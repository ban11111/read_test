import React, { Component, createRef } from 'react'
import { isDesktop, isMobile, isTablet } from 'react-device-detect'
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
      begin: false, // ????????????????????? ?????????BasicInfo?????????true
      status: 'init', // ????????????
      src: '', // ????????????????????? ???????????????????????????
      input: '', // ?????????????????????
      audioConf: defaultAudioConf,
      wordIndex: 0,
      reRenderTimer: false,
      words: [' '],
      warningPopUp: false, // ???????????????????????????????????? ??????????????????
      uploadingLock: false, // ?????????????????????
      buttonDisabled: false, // ??????????????????
      paper_info: {
        paper_name: '',
        paper_version: '',
        paper_id: 0,
        interval: 10 // ???
      }
    }
    this.recorded = false // ?????????????????????????????????????????? ??????????????? ????????????interval??????blob???
    this.audioBlob = null // ???????????????????????????????????? ?????????interval????????? ????????????????????????????????????
    this.translationRef = createRef()
    this.audioPlayRef = createRef()
    this.recordButtonRef = createRef()
    this.rec = Recorder({
      type: 'mp3',
      bitRate: defaultAudioConf.bitRate,
      sampleRate: defaultAudioConf.sampleRate,
      disableEnvInFix: false,
      onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
        this.wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate) //???????????????????????????????????????
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
        this.beginTime = moment() // ???????????????????????????
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
        this.wave = Recorder.WaveView({ elem: '.wave-box' }) // ??????wave??????
        this.rec.close()
      },
      (msg, isUserNotAllow) => {
        isUserNotAllow //?????????????????????????????????
          ? toast.error('please allow the mic permission, refresh or restart the browser')
          : toast.error('your device or web browser do not support audio recording, msg:' + msg)
      }
    )
  }

  uploadFile = (blob, duration, next) => {
    const formData = new FormData()
    if (blob) {
      formData.append('record', blob, duration + '.mp3') // fileName ?????????,??????????????????????????????
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
    formData.append('device', isTablet ? 'tablet' : isMobile ? 'mobile' : isDesktop ? 'desktop' : 'unknown')
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
        this.wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate) //???????????????????????????????????????
      }
    })
    this.rec.open(
      () => {
        this.rec.start()
        const set = this.rec.set
        console.log('????????????' + set.type + ' ' + set.sampleRate + 'hz ' + set.bitRate + 'kbps')
      },
      (msg, isUserNotAllow) => {
        console.log((isUserNotAllow ? 'UserNotAllow???' : '') + '????????????:' + msg, 1)
      }
    )
  }

  recStop() {
    this.rec.stop(
      (blob, duration) => {
        this.rec.close() // ?????????????????????????????????????????????????????????????????????start????????????????????????????????????????????????
        console.log('audio duration: ', duration)
        this.audioBlob = blob
        this.setState({ src: window.URL.createObjectURL(blob) })
      },
      msg => {
        console.log('????????????:' + msg, 1)
        this.rec.close() //????????????stop????????????3????????????????????????close
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
    // ????????????????????????
    if (this.state.warningPopUp) {
      this.uploadLoop(this.state.paper_info.interval * 1000)
    } else {
      this.translationRef.current.lastChild.firstChild.focus()
    }
    this.setState({ status: 'stopped', warningPopUp: false })
  }

  playAndStop = () => {
    this.audioPlayRef.current.play()
  }

  onNext = timesUp => () => {
    const duration = timesUp ? this.state.paper_info.interval * 1000 : moment().diff(this.beginTime, 'milliseconds')
    if (timesUp && this.state.status === 'recording') {
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
        window.URL.revokeObjectURL(this.state.src) // ?????? dataUrl
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
            this.beginTime = moment() // ???????????????????????????
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
        isPlaying={this.state.begin && !this.state.uploadingLock}
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
            }, 888) // ??????0.1???????????????
          }
          return <div style={{ fontSize: 'xx-large' }}>{remainingTime}</div>
        }}
      </CountdownCircleTimer>
    )
  }

  renderWarningPopUp = () => {
    return (
      <Snackbar open={this.state.warningPopUp} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="warning">Sorry, time's up! Click bottom button to enter the next word...</Alert>
      </Snackbar>
    )
  }

  render() {
    const {
      begin,
      status,
      src,
      words,
      wordIndex,
      reRenderTimer,
      uploadingLock,
      buttonDisabled,
      warningPopUp
    } = this.state
    const currentWord = words[wordIndex]
    const recording = status === 'recording'

    return (
      <Container maxWidth="sm" className="exam-page">
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
          <Grid item xs={12}>
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
              disabled={warningPopUp}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="outlined"
              style={{ marginTop: 15, float: 'right' }}
              onClick={this.onNext()}
              disabled={buttonDisabled || recording}
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
          {/*????????????, ?????????????????? grid ??????????????????: ??????????????????*/}
          {/*<Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>*/}
          {/*  /!*MuiContainer-maxWidthSm ??????container???CSS??? @media ?????? maxWidth???600px*!/*/}
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
