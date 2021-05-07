import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import moment from 'moment'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'
import Editor from './editor/editor'
import { Table } from 'antd'
import api from 'api'
import { toast } from 'react-toastify'
import { markDuplicates } from '../../../utils/duplicate'

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}))

const columns = [
  { title: 'Id', dataIndex: 'id', sorter: (a, b) => a.id - b.id, sortDirections: ['ascend', 'descend', 'ascend'] },
  { title: 'CreatedAt', dataIndex: 'created_at', render: createdAt => moment(createdAt).format('YYYY-MM-DD hh:mm:ss') },
  {
    title: 'Name',
    render: paper =>
      paper.inuse ? (
        <span style={{ color: 'green', fontSize: 'x-large' }}>{paper.name}</span>
      ) : (
        <span>{paper.name}</span>
      )
  },
  { title: 'Interval(/s)', dataIndex: 'interval' },
  {
    title: 'Words',
    dataIndex: 'words',
    render: words =>
      // eslint-disable-next-line no-control-regex
      markDuplicates(words.split(RegExp('[ \t\n]+'))).map((item, index) => (
        <Chip
          key={index}
          variant="outlined"
          size="small"
          label={item.word}
          color={item.dup ? 'secondary' : 'primary'}
        />
      ))
  },
  {
    title: 'Operation',
    render: undefined,
    fixed: 'right'
  }
]
const rowSelection = {
  getCheckboxProps: paper => ({
    paper_id: paper.id
  })
}

const Results = ({ className, papers, refreshPaper, ...rest }) => {
  const classes = useStyles()
  const [editProps, setEditProps] = useState({ open: false, refreshPaper: refreshPaper })

  const onClickEditExit = () => {
    setEditProps({ open: false })
  }

  const handleEditClicked = data => () => {
    setEditProps({ open: true, onClickExit: onClickEditExit, data: data, refreshPaper: refreshPaper })
  }

  const onClickPublish = pid => () => {
    api.publishPaper({ pid: pid }).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        toast.success('success!')
        refreshPaper()
      }
    })
  }

  columns[5].render = record => (
    <ButtonGroup size="small">
      <Button color="primary" onClick={handleEditClicked(record)}>
        edit
      </Button>
      <Button color="primary" onClick={onClickPublish(record.id)}>
        publish
      </Button>
      <Button color="secondary">delete</Button>
    </ButtonGroup>
  )

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Editor {...editProps} type="edit" />
      <Box minWidth={600}>
        <Table
          scroll={{ x: true }}
          rowKey="id"
          columns={columns}
          dataSource={papers}
          rowSelection={{ ...rowSelection, type: 'checkbox' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `Total ${total} Papers`
          }}
        />
      </Box>
    </Card>
  )
}

Results.propTypes = {
  className: PropTypes.string,
  papers: PropTypes.array.isRequired
}

export default Results
