import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Recorder from 'recorder-core'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import { TranslationOutlined } from '@ant-design/icons'
import { dataSets } from './data'
import { makeStyles, MenuItem, Select } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  button: { marginTop: 30 },
  button_focused: { marginTop: 30, color: 'green', fontSize: 18, fontWeight: 'bold' }
}))

const defaultAudioConf = {
  bitRate: 128, // kbps
  sampleRate: 16000 // hz
}

const InstructionPage = props => {
  const classes = useStyles()
  const [buttonFocused, setButtonFocused] = useState(false)
  const [recordable, setRecordable] = useState(false)
  const [langIndex, setLangIndex] = useState(0)

  const rec = Recorder({
    type: 'mp3',
    bitRate: defaultAudioConf.bitRate,
    sampleRate: defaultAudioConf.sampleRate,
    disableEnvInFix: false
  })

  const focus = () => {
    setButtonFocused(true)
  }

  const unFocus = () => {
    setButtonFocused(false)
  }

  useEffect(() => {
    console.log('正在打开录音，请求麦克风权限...')
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

  const langSelect = e => {
    setLangIndex(e.target.value)
  }

  const renderLangList = () => {
    return (
      <>
        <Select onChange={langSelect} value={langIndex} style={{ float: 'right', position: 'relative', bottom: 6 }}>
          {dataSets.map((content, index) => (
            <MenuItem key={'sel' + index} value={index}>
              {content.lang}
            </MenuItem>
          ))}
        </Select>
        <TranslationOutlined style={{ float: 'right', marginRight: 5 }} />
      </>
    )
  }

  return (
    <Container maxWidth="xs">
      <Typography component="h1" variant="h5" style={{ marginTop: 30 }}>
        Test Instructions
        {renderLangList()}
      </Typography>
      <Divider />
      <ul style={{ marginTop: 40 }}>
        {dataSets[langIndex].instructions.map((content, index) => (
          <li {...listStyle} key={'ins' + index}>
            {content}
          </li>
        ))}
      </ul>
      {dataSets[langIndex].endings.map((content, index) => (
        <li key={'end' + index}>
          <Typography component="span" variant="body1">
            {content}
          </Typography>
        </li>
      ))}
      <Button
        className={buttonFocused ? classes.button_focused : classes.button}
        fullWidth
        disabled={!recordable}
        variant="outlined"
        onClick={() => {
          props.history.push('/examination')
        }}
        onMouseEnter={focus}
        onMouseLeave={unFocus}
        onFocus={focus}
        onBlur={unFocus}
      >
        {dataSets[langIndex].button}
      </Button>
    </Container>
  )
}

export default InstructionPage
