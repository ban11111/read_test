import React from 'react'
// import tmpMp3 from 'public/static/audio/Basketcase-Live.mp3'
import { Box, Container } from '@material-ui/core'

const Detail = props => {
  console.log('Detail???????????', props)
  const p = { style: { margin: 8 } }
  return (
    <Container>
      <a {...p}>{'这边用来展示这个用户的测试结果'}</a>
      <a {...p}>{'显示用户姓名'}</a>
      <audio controls src={'public/static/audio/Basketcase-Live.mp3'} {...p} />
      <a {...p}>{'这里显示翻译结果'}</a>
      <a {...p}>{'这里显示用时'}</a>
      <br />
      <Box component="h1" m={1}>
        <a>这里也做个表格， 用来展示详细答题结果 （TODO）</a>
      </Box>
    </Container>
  )
}

export default Detail
