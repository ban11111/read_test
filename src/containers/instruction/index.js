import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Recorder from 'recorder-core'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

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

  const listStyle = { style: { listStyle: 'disc' } }

  return (
    <Container maxWidth="xs">
      <Typography component="h1" variant="h5" style={{ marginTop: 30 }}>
        Test Instructions
      </Typography>
      <Divider />
      <ul style={{ marginTop: 40 }}>
        <li {...listStyle}>Please enable recording permission if you see relative pop-up.</li>
        <li {...listStyle}>Please test in a quiet environment.</li>
        <li {...listStyle}>
          Please click the record button and read the presented word. After reading the word, click the record button
          again to end.
        </li>
        <li {...listStyle}>Please input the meaning of the word in your native language.</li>
        <li {...listStyle}>The time limit for each word is 15 seconds.</li>
        <li {...listStyle}>Please click the “NEXT” button after completing each word.</li>
        <li {...listStyle}>Please click the “NEXT” button if you do not know the word.</li>
        <li {...listStyle}>Please do not consult the dictionary & textbooks or search the word online.</li>
        <li {...listStyle}>Please do not quit before completion.</li>
      </ul>
      <Typography component="span" variant="body1">
        Information provided will be treated strictly confidential and will not be disclosed to third parties.
      </Typography>
      <br />
      <Typography component="span" variant="body1">
        We will not send you any irrelevant information.
      </Typography>
      <br />
      <Typography component="span" variant="body1">
        Thank you for your participation!
      </Typography>
      <Button
        style={{ marginTop: 30 }}
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
