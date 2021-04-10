import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { columns } from './const'
import { toast } from 'react-toastify'
import api from 'api'

const Detail = props => {
  const req = {
    uid: parseInt(props.location.pathname.split('/').pop()),
    paper_id: 1 // todo
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getAnswers, [])

  return (
    <>
      <Table columns={columns} dataSource={answers} />
    </>
  )
}

export default Detail
