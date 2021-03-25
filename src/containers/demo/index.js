import React, { Component } from 'react'
import './index.css'
import api from '../../api'

import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'

import { makeStyles, styled, ThemeProvider, withStyles } from '@material-ui/core/styles'
import { blue, green, red } from '@material-ui/core/colors'
// import CircularProgress from '@material-ui/core/CircularProgress'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import {
  Fab,
  Button,
  Container,
  Grid,
  Paper,
  MobileStepper,
  TextField,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  word: {
    fontSize: 'x-large',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}))

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

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rec: null,
      status: 'init',
      src: '',
      input: '',
      audioConf: defaultAudioConf,
      wordIndex: 0,
      words: ['要读的字', '字2', '字3', '后面会在', '管理页面开放配置'],
      answers: [], // {upload_url:"s3上传路径", translation:"翻译"}
      reRenderTimer: false
    }
    this.translationRef = React.createRef()
  }

  wave
  rec = Recorder({
    type: 'mp3',
    bitRate: defaultAudioConf.bitRate,
    sampleRate: defaultAudioConf.sampleRate,
    disableEnvInFix: false,
    onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
      this.wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate) //输入音频数据，更新显示波形
    }
  })

  renderVisualization = () => {
    return <div style={{ height: '50px' }} className="wave-box" />
  }

  timeoutFn = setTimeout(() => {
    console.log('无法录音：权限请求被忽略（超时假装手动点击了确认对话框）', 1)
  }, 10000)

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   return nextState.wordIndex !== this.state.wordIndex
  // }

  componentDidMount() {
    console.log('正在打开录音，请求麦克风权限...')
    this.rec.open(
      () => {
        clearTimeout(this.timeoutFn)
        console.log('已打开录音，可以点击开始了', 2)
        this.wave = Recorder.WaveView({ elem: '.wave-box' }) // 创建wave对象
        this.rec.close()
      },
      (msg, isUserNotAllow) => {
        //用户拒绝未授权或不支持
        clearTimeout(this.timeoutFn)
        console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg, 1)
      }
    )
  }

  uploadFile = (blob, duration) => {
    const formData = new FormData()
    formData.append('record', blob, duration + '.mp3')
    api.uploadAudio(formData).then(resp => {
      console.log('resp', resp)
    })
  }

  recStart = () => {
    // if (this.rec && this.rec.IsOpen()) {
    //   this.rec.close()
    // }
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
        clearTimeout(this.timeoutFn)
        this.rec.start()
        const set = this.rec.set
        console.log('录制中：' + set.type + ' ' + set.sampleRate + 'hz ' + set.bitRate + 'kbps')
      },
      (msg, isUserNotAllow) => {
        clearTimeout(this.timeoutFn)
        console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg, 1)
      }
    )
  }

  mouseDown = () => {
    this.setState({ status: 'recording' })
    this.recStart()
    document.onmouseup = this.touchUp
  }

  touchUp = () => {
    this.setState({ status: 'stopped' }, () => {
      document.onmouseup = null
    })
    this.recStop()
    // console.log('????????????????', this.translationRef)
    this.translationRef.current.lastChild.firstChild.focus()
  }

  touchDown = () => {
    this.setState({ status: 'recording' })
    this.recStart()
  }

  recStop() {
    this.rec.stop(
      (blob, duration) => {
        this.rec.close() //释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时手机端播放音频有杂音
        this.uploadFile(blob, duration)
        this.setState({ src: window.URL.createObjectURL(blob) }, () => {
          console.log('src', this.state.src)
        })
        // this.rec = null
      },
      msg => {
        console.log('录音失败:' + msg, 1)
        this.rec.close() //可以通过stop方法的第3个参数来自动调用close
        // this.rec = null
      }
    )
  }

  playAndStop = () => {
    this.refs.audio.play()
  }

  onClickNext = () => {
    if (this.state.wordIndex >= this.state.words.length - 1) {
      this.props.history.push('/finish')
      return
    }
    this.setState(
      {
        wordIndex: this.state.wordIndex + 1,
        reRenderTimer: true,
        answers: this.state.answers.concat({ upload_url: 'todo', translation: this.state.input })
      },
      () => {
        this.setState({ reRenderTimer: false, src: '', input: '' })
      }
    )
  }
  onClickBack = () => {
    if (this.state.wordIndex <= 0) {
      return
    }
    this.setState({ wordIndex: this.state.wordIndex - 1, reRenderTimer: true }, () => {
      this.setState({ reRenderTimer: false })
    })
  }

  updateAudioConf = (sampleRate, bitRate) => {
    this.setState({ audioConf: { sampleRate: sampleRate, bitRate: bitRate } })
  }

  renderCountDown = wordIndex => {
    return (
      <CountdownCircleTimer
        isPlaying={true}
        duration={10}
        size={60}
        strokeWidth={8}
        colors={[
          [green.A200, 0.33],
          [blue['300'], 0.33],
          [red['500'], 0.34]
        ]}
        onComplete={totalElapsedTime => {
          console.log(totalElapsedTime, wordIndex, 'on complete')
          this.onClickNext()
        }}
      >
        {({ remainingTime }) => {
          return <div style={{ fontSize: 'xx-large' }}>{remainingTime}</div>
        }}
      </CountdownCircleTimer>
    )
  }

  render() {
    const { status, src, words, wordIndex, audioConf, reRenderTimer } = this.state
    const currentWord = words[wordIndex]
    const recording = status === 'recording'
    return (
      <Container maxWidth="sm" className="demo-page">
        <Grid container spacing={2} className={useStyles.wrapper} alignItems={'center'}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            {!reRenderTimer && this.renderCountDown(wordIndex)}
          </Grid>
          <Grid item xs={12}>
            <div>
              <Word>{currentWord}</Word>
            </div>
          </Grid>
          <Grid item xs={2}>
            <Fab
              className="nocopy"
              variant="extended"
              onMouseDown={this.mouseDown}
              onTouchStart={this.touchDown}
              onTouchEnd={this.touchUp}
              onContextMenu={e => {
                e.preventDefault()
              }}
              size="medium"
              color={recording ? 'default' : 'primary'}
            >
              {recording ? '松开\n结束' : '按住\n录音'}
            </Fab>
          </Grid>
          <Grid item xs={8}>
            {this.renderVisualization()}
          </Grid>
          <Grid item xs={2}>
            <Button color="secondary" variant="contained" onClick={this.playAndStop} style={{ float: 'right' }}>
              Play
            </Button>
          </Grid>
          <Grid item xs={12}>
            <audio controls ref="audio" src={src} />
          </Grid>

          <Grid item xs={12}>
            <ValidationTextField
              ref={this.translationRef}
              label="Input translation here"
              required
              fullWidth
              variant="outlined"
              id="validation-outlined-input"
              value={this.state.input}
              onChange={e => {
                this.setState({ input: e.currentTarget.value })
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Progress
              variant="progress"
              steps={words.length}
              position="static"
              activeStep={wordIndex}
              nextButton={
                <Button size="small" onClick={this.onClickNext}>
                  {wordIndex < words.length - 1 ? 'Next' : 'Finish'}
                  {ThemeProvider.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button size="small" onClick={this.onClickBack} disabled={wordIndex === 0}>
                  {ThemeProvider.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  Back
                </Button>
              }
            />
          </Grid>
          <Grid item xs={6}>
            <InputLabel>采样率</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={audioConf.sampleRate}
              onChange={v => {
                this.updateAudioConf(v.target.value, audioConf.bitRate)
              }}
            >
              <MenuItem value={8000}>8000</MenuItem>
              <MenuItem value={11025}>11025</MenuItem>
              <MenuItem value={16000}>16000</MenuItem>
              <MenuItem value={22050}>22050</MenuItem>
              <MenuItem value={24000}>24000</MenuItem>
              <MenuItem value={44100}>44100</MenuItem>
              <MenuItem value={48000}>44100</MenuItem>
              <MenuItem value={50000}>50000</MenuItem>
              <MenuItem value={96000}>96000</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="比特率"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              variant="filled"
              value={audioConf.bitRate}
              onChange={v => {
                this.updateAudioConf(audioConf.sampleRate, v.target.value)
              }}
            />
          </Grid>
        </Grid>
      </Container>
    )
  }
}
