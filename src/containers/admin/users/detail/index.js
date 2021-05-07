import React, { useEffect, useState } from 'react'
import { Spin, Table } from 'antd'
import { columns } from './const'
import { toast } from 'react-toastify'
import api from 'api'
import { antIcon } from 'utils/spinIcon'

const Detail = props => {
  const path = props.location.pathname.split('/')
  const req = {
    uid: parseInt(path.pop()),
    paper_id: parseInt(path.pop()) || 1
  }

  const [answers, setAnswers] = useState([])
  const [spin, setSpin] = useState(true)

  const getAnswers = () => {
    api.QueryAnswers(req).then(res => {
      setSpin(false)
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
    <Spin indicator={antIcon} spinning={spin}>
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
    </Spin>
  )
}

export default Detail
