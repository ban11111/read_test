import React, { useEffect, useState } from 'react'
import { Box, Container } from '@material-ui/core'
import { Table } from 'antd'
import { columns } from './const'
import { toast } from 'react-toastify'
import api from 'api'

const Detail = props => {
  const p = { style: { margin: 8 } }
  const req = {
    uid: parseInt(props.location.pathname.split('/').pop()),
    paper_id: 1
  }

  const [answers, setAnswers] = useState([])

  const getAnswers = () => {
    api.QueryAnswers(req).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        setAnswers(res.data)
      }
    })
  }

  useEffect(getAnswers, [])

  return (
    <>
      <Table columns={columns} dataSource={answers} />
      <Container>
        <span {...p}>{'这边用来展示这个用户的测试结果'}</span>
        <span {...p}>{'显示用户姓名'}</span>
        <audio controls src={'public/static/audio/Basketcase-Live.mp3'} {...p} />
        <span {...p}>{'这里显示翻译结果'}</span>
        <span {...p}>{'这里显示用时'}</span>
        <br />
        <Box component="h1" m={1}>
          <span>这里也做个表格， 用来展示详细答题结果 （TODO）</span>
        </Box>
      </Container>
    </>
  )
}

export default Detail
