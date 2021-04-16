import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { columns } from './const'
import { toast } from 'react-toastify'
import api from 'api'

const Detail = props => {
  const path = props.location.pathname.split('/')
  const req = {
    uid: parseInt(path.pop()),
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
      <Table
        rowKey="id"
        columns={columns}
        dataSource={answers}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} Answers`
        }}
      />
    </>
  )
}

export default Detail
