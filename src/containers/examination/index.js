import React, { Component, createRef } from 'react'
// import { isMobile } from 'react-device-detect'
import './index.css'
import api from '../../api'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'
import { styled, withStyles } from '@material-ui/core/styles'
import { blue, green, red } from '@material-ui/core/colors'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MobileStepper from '@material-ui/core/MobileStepper'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import MicNone from '@material-ui/icons/MicNone'
import PauseIcon from '@material-ui/icons/Pause'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import { KeyUserInfo, storageGet } from '../../global/storage'
import { toast } from 'react-toastify'
import moment from 'moment'
import Alert from '@material-ui/lab/Alert'
import { disableBodyScroll } from 'body-scroll-lock'
// import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
// import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
// import Box from '@material-ui/core/Box'
// import InputBase from '@material-ui/core/InputBase'
// import Divider from '@material-ui/core/Divider'

const Word = styled(Paper)({
  fontSize: 'xxx-large',
  fontFamily: 'cursive',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const ValidationTextField = withStyles({
  root: {
    marginTop: 15,
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2
    },
    '& input:invalid + fieldset': {
      borderColor: 'lightBlue',
      borderWidth: 2
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      padding: '4px !important' // override inline-style
    }
  }
})(TextField)

const Progress = styled(MobileStepper)({
  root: {
    maxWidth: 400,
    flexGrow: 1
  }
})

const defaultAudioConf = {
  bitRate: 128, // kbps
  sampleRate: 16000 // hz
}

export default class Examination extends Component {
  constructor(props) {
    super(props)
    this.state = {
      begin: false, // 测试开始标识， 在获取BasicInfo后置为true
      status: 'init', // 录音状态
      src: '', // 用于在当前字词 播放音频，给用户听
      input: '', // 当前字词的翻译
      audioConf: defaultAudioConf,
      wordIndex: 0,
      reRenderTimer: false,
      words: [' '],
      warningPopUp: false, // 如果长按不放到时间结束， 需要弹出提醒
      uploadingLock: false, // 上传时锁定页面
      buttonDisabled: false, // 用户按键防抖
      paper_info: {
        paper_name: '',
        paper_version: '',
        paper_id: 0,
        interval: 10 // 秒
      }
    }
    this.recorded = false // 用户标识当前字有没有录音过， 如果没有， 就不用了interval等待blob了
    this.audioBlob = null // 因为音频生成有一定延时， 需要用interval轮询， 避免在低配机器上发生漏传
    this.translationRef = createRef()
    this.audioPlayRef = createRef()
    this.recordButtonRef = createRef()
    this.rec = Recorder({
      type: 'mp3',
      bitRate: defaultAudioConf.bitRate,
      sampleRate: defaultAudioConf.sampleRate,
      disableEnvInFix: false,
      onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
        this.wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate) //输入音频数据，更新显示波形
      }
    })
    this.userInfo = storageGet(KeyUserInfo)
  }

  renderVisualization = () => {
    return <div style={{ height: '50px' }} className="wave-box" />
  }

  getBasicInfo = () => {
    api.getBasicInfo({ uid: this.userInfo.id }).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        // eslint-disable-next-line no-control-regex
        const words = res.data.current_paper.words.split(RegExp('[ \t\n]+'))
        if (res.data.progress_index >= words.length - 1) {
          toast.info(
            "you've already finished current test, please wait util the next test released, " +
              "if there's any issue, please contact your teacher"
          )
          this.props.history.push('/finish')
          return
        }
        this.setState(
          {
            audioConf: {
              bitRate: res.data.global_setting['BitRate'], // kbps
              sampleRate: res.data.global_setting['SampleRate'] // hz
            },
            wordIndex: res.data.progress_index + 1,
            words: words,
            paper_info: {
              paper_name: res.data.current_paper.name,
              paper_version: res.data.current_paper.version,
              paper_id: res.data.current_paper.id,
              interval: res.data.current_paper.interval
            },
            begin: true,
            reRenderTimer: true
          },
          () => {
            this.setState({ reRenderTimer: false })
            disableBodyScroll(this.recordButtonRef.current)
            this.wave = Recorder.WaveView({ elem: '.wave-box' })
          }
        )
        this.beginTime = moment() // 用于计算每道题耗时
      }
    })
  }

  componentDidMount() {
    if (this.userInfo == null) {
      this.props.history.push('/info')
      return
    }
    this.getBasicInfo()
    this.rec.open(
      () => {
        this.wave = Recorder.WaveView({ elem: '.wave-box' }) // 创建wave对象
        this.rec.close()
      },
      (msg, isUserNotAllow) => {
        isUserNotAllow //用户拒绝未授权或不支持
          ? toast.error('please allow the mic permission, refresh or restart the browser')
          : toast.error('your device or web browser do not support audio recording, msg:' + msg)
      }
    )
  }

  uploadFile = (blob, duration, next) => {
    const formData = new FormData()
    if (blob) {
      formData.append('record', blob, duration + '.mp3') // fileName 不重要,服务端自己设置文件名
    }
    formData.append('file_ext', 'mp3')
    formData.append('paper_name', this.state.paper_info.paper_name)
    formData.append('paper_version', this.state.paper_info.paper_version)
    formData.append('paper_id', this.state.paper_info.paper_id + '')
    formData.append('uid', this.userInfo.id)
    formData.append('word_index', this.state.wordIndex)
    formData.append('word', this.state.words[this.state.wordIndex])
    formData.append('translation', this.state.input)
    formData.append('duration', duration)
    api.uploadAudio(formData).then(resp => {
      if (!resp.success) {
        toast.error(resp.info + " -- if you can't go to next word, try refresh the page")
      } else {
        next()
      }
    })
  }

  recStart = () => {
    this.rec = Recorder({
      type: 'mp3',
      bitRate: this.state.audioConf.bitRate,
      sampleRate: this.state.audioConf.sampleRate,
      disableEnvInFix: false,
      onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
        this.wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate) //输入音频数据，更新显示波形
      }
    })
    this.rec.open(
      () => {
        this.rec.start()
        const set = this.rec.set
        console.log('录制中：' + set.type + ' ' + set.sampleRate + 'hz ' + set.bitRate + 'kbps')
      },
      (msg, isUserNotAllow) => {
        console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg, 1)
      }
    )
  }

  recStop() {
    this.rec.stop(
      (blob, duration) => {
        this.rec.close() // 释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时手机端播放音频有杂音
        console.log('audio duration: ', duration)
        this.audioBlob = blob
        this.setState({ src: window.URL.createObjectURL(blob) })
      },
      msg => {
        console.log('录音失败:' + msg, 1)
        this.rec.close() //可以通过stop方法的第3个参数来自动调用close
      }
    )
  }

  onClickStart = () => {
    this.recorded = true
    this.setState({ status: 'recording' })
    this.recStart()
  }

  onClickStop = () => {
    this.recStop()
    // 说明长按且超时了
    if (this.state.warningPopUp) {
      this.uploadLoop(this.state.paper_info.interval * 1000)
    } else {
      this.translationRef.current.lastChild.firstChild.focus()
    }
    this.setState({ status: 'stopped', warningPopUp: false })
  }

  mouseDown = () => {
    this.recorded = true
    this.setState({ status: 'recording' })
    this.recStart()
    document.onmouseup = this.mouseUp
  }

  mouseUp = () => {
    document.onmouseup = null
    this.recStop()
    // 说明长按且超时了
    if (this.state.warningPopUp) {
      this.uploadLoop(this.state.paper_info.interval * 1000)
    } else {
      this.translationRef.current.lastChild.firstChild.focus()
    }
    this.setState({ status: 'stopped', warningPopUp: false })
  }

  touchUp = () => {
    this.recStop()
    // 说明长按且超时了
    if (this.state.warningPopUp) {
      this.uploadLoop(this.state.paper_info.interval * 1000)
    } else {
      this.translationRef.current.lastChild.firstChild.focus()
    }
    this.setState({ status: 'stopped', warningPopUp: false })
  }

  touchDown = () => {
    this.recorded = true
    this.setState({ status: 'recording' })
    this.recStart()
  }

  playAndStop = () => {
    this.audioPlayRef.current.play()
  }

  timesUpTouchUp = duration => () => {
    document.onmouseup = null
    this.uploadLoop(duration)
    this.setState({ status: 'stopped', warningPopUp: false })
  }

  onNext = timesUp => () => {
    const duration = timesUp ? this.state.paper_info.interval * 1000 : moment().diff(this.beginTime, 'milliseconds')
    if (timesUp && this.state.status === 'recording') {
      document.onmouseup = this.timesUpTouchUp(duration)
      this.setState({ warningPopUp: true })
      this.recStop()
    } else {
      this.uploadLoop(duration)
    }
  }

  uploadLoop = duration => {
    this.setState({ uploadingLock: true })
    const iv = setInterval(() => {
      if (this.recorded && !this.audioBlob) {
        return
      }
      clearInterval(iv)
      this.recorded = false
      this.uploadFile(this.audioBlob, duration, () => {
        window.URL.revokeObjectURL(this.state.src) // 清除 dataUrl
        if (this.state.wordIndex >= this.state.words.length - 1) {
          this.props.history.push('/finish')
          return
        }
        this.audioBlob = null
        this.setState(
          {
            wordIndex: this.state.wordIndex + 1,
            reRenderTimer: true,
            src: '',
            input: '',
            uploadingLock: false,
            buttonDisabled: true
          },
          () => {
            this.beginTime = moment() // 用于计算每道题耗时
            this.setState({ reRenderTimer: false })
          }
        )
        setTimeout(() => {
          this.setState({ buttonDisabled: false })
        }, 999)
      })
    }, 250)
  }

  renderCountDown = wordIndex => {
    return (
      <CountdownCircleTimer
        isPlaying={!this.state.uploadingLock}
        duration={this.state.paper_info.interval}
        size={60}
        strokeWidth={8}
        colors={[
          [green.A200, 0.33],
          [blue['300'], 0.33],
          [red['500'], 0.34]
        ]}
        onComplete={totalElapsedTime => {
          console.log(totalElapsedTime, wordIndex, 'on complete')
          this.onNext(true)()
        }}
      >
        {({ remainingTime }) => {
          if (remainingTime === 1) {
            setTimeout(() => {
              this.setState({ buttonDisabled: true })
            }, 888) // 最后0.1秒不给点击
          }
          return <div style={{ fontSize: 'xx-large' }}>{remainingTime}</div>
        }}
      </CountdownCircleTimer>
    )
  }

  renderWarningPopUp = () => {
    return (
      <Snackbar open={this.state.warningPopUp} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="warning">Sorry, time's up! Release button to enter the next word...</Alert>
      </Snackbar>
    )
  }

  render() {
    const { begin, status, src, words, wordIndex, reRenderTimer, uploadingLock, buttonDisabled } = this.state
    const currentWord = words[wordIndex]
    const recording = status === 'recording'

    return (
      <Container maxWidth="sm" className="demo-page">
        <Progress variant="progress" steps={words.length} position="static" activeStep={wordIndex} />
        <Backdrop open={!begin || uploadingLock} style={{ zIndex: 1201 }}>
          <CircularProgress color="inherit" size={150} thickness={2} />
        </Backdrop>
        {this.renderWarningPopUp()}
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            {!reRenderTimer && this.renderCountDown(wordIndex)}
          </Grid>
          <Grid item xs={12}>
            <div>
              <Word>{currentWord}</Word>
            </div>
          </Grid>
          <Grid item xs={10}>
            {this.renderVisualization()}
          </Grid>
          <Grid item xs={2}>
            <IconButton
              color="primary"
              variant="outlined"
              onClick={this.playAndStop}
              disabled={recording}
              style={{ float: 'right' }}
            >
              <PlayCircleOutlineIcon style={{ fontSize: 50 }} />
            </IconButton>
          </Grid>
          <audio ref={this.audioPlayRef} src={src} />
          <Grid item xs={10}>
            <ValidationTextField
              ref={this.translationRef}
              label="Input translation here"
              required
              fullWidth
              autoComplete="off"
              variant="outlined"
              id="validation-outlined-input"
              value={this.state.input}
              onChange={e => {
                this.setState({ input: e.currentTarget.value })
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              variant="text"
              style={{ marginTop: 15 }}
              onClick={this.onNext()}
              disabled={buttonDisabled}
            >
              NEXT
            </Button>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              variant="round"
              ref={this.recordButtonRef}
              className="nocopy"
              onClick={recording ? this.onClickStop : this.onClickStart}
              size="medium"
              color={recording ? 'default' : 'primary'}
              style={{ position: 'absolute', bottom: 50, border: 'thick solid' }}
            >
              {recording ? <PauseIcon style={{ fontSize: 80 }} /> : <MicNone style={{ fontSize: 80 }} />}
            </IconButton>
          </Grid>
          {/*纪念一下, 绝对位置导致 grid 长度无法继承: 解决方案如下*/}
          {/*<Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>*/}
          {/*  /!*MuiContainer-maxWidthSm 复用container的CSS， @media 以及 maxWidth：600px*!/*/}
          {/*  <Box position="absolute" bottom={0} className="MuiContainer-maxWidthSm" width="100%">*/}
          {/*    <Progress*/}
          {/*      variant="progress"*/}
          {/*      steps={words.length}*/}
          {/*      position="static"*/}
          {/*      activeStep={wordIndex}*/}
          {/*      nextButton={*/}
          {/*        <Button size="small" onClick={this.onNext()} disabled={buttonDisabled}>*/}
          {/*          {wordIndex < words.length - 1 ? 'Next' : 'Finish'}*/}
          {/*          {ThemeProvider.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}*/}
          {/*        </Button>*/}
          {/*      }*/}
          {/*      // backButton={*/}
          {/*      //   <Button size="small" onClick={this.onClickBack} disabled>*/}
          {/*      //     {ThemeProvider.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}*/}
          {/*      //     Back*/}
          {/*      //   </Button>*/}
          {/*      // }*/}
          {/*    />*/}
          {/*  </Box>*/}
          {/*</Grid>*/}
        </Grid>
      </Container>
    )
  }
}
