import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Recorder from 'recorder-core'
import Button from '@material-ui/core/Button'

const defaultAudioConf = {
  bitRate: 128, // kbps
  sampleRate: 16000 // hz
}

const InstructionPage = props => {
  const [recordable, setRecordable] = useState(false)

  const rec = Recorder({
    type: 'mp3',
    bitRate: defaultAudioConf.bitRate,
    sampleRate: defaultAudioConf.sampleRate,
    disableEnvInFix: false
  })

  useEffect(() => {
    console.log('正在打开录音，请求麦克风权限...', props)
    rec.open(
      () => {
        console.log('已打开录音，可以点击开始了')
        rec.close()
        setRecordable(true)
      },
      (msg, isUserNotAllow) => {
        // 用户拒绝未授权或不支持
        console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxWidth="xs">
      <Typography component="h1" variant="h5">
        Instructions:
      </Typography>
      <Typography component="span" variant="body1">
        Please enable recording permission
      </Typography>
      <Button
        fullWidth
        disabled={!recordable}
        variant="outlined"
        onClick={() => {
          props.history.push('/examination')
        }}
      >
        Agree And Proceed
      </Button>
    </Container>
  )
}

export default InstructionPage
