import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import getInitials from 'utils/getInitials'
import { Table } from 'antd'
import api from 'api'
import { toast } from 'react-toastify'
import { CardContent, InputAdornment, SvgIcon, TextField } from '@material-ui/core'
import { Search as SearchIcon } from 'react-feather'

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  toolBar: {
    marginBottom: theme.spacing(2)
  }
}))

const columns = [
  { title: 'Name', dataIndex: 'name', render: undefined },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Chinese Class', dataIndex: 'chinese_class' },
  { title: 'HSK Level', dataIndex: 'hks_level' },
  { title: 'Ethnic Background', dataIndex: 'ethnic_background' },
  {
    title: 'Exam Result',
    render: () => {
      return '这里展示做过哪些试卷？'
    }
  },
  {
    title: 'RegisteredAt',
    dataIndex: 'created_at',
    render: time => {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  { title: 'Operation', dataIndex: 'id', render: undefined }
]
const rowSelection = {
  getCheckboxProps: user => ({
    uid: user.id
  })
}

const Results = ({ className, users, reload, history, ...rest }) => {
  const classes = useStyles()
  const [filterUserName, setFilterUserName] = useState('')
  const [deletePopInfo, setDeletePopInfo] = useState(0) // 只需要uid就可以了

  const handleReview = e => {
    history.push('/admin/users/' + e.currentTarget.value)
  }

  const handleOpen = user => () => {
    setDeletePopInfo(user)
  }

  columns[0].render = name => {
    return (
      <Box alignItems="center" display="flex">
        <Avatar className={classes.avatar}>{getInitials(name)}</Avatar>
        <Typography color="textPrimary" variant="body1">
          {name}
        </Typography>
      </Box>
    )
  }
  columns[7].render = uid => {
    return (
      <ButtonGroup size="small">
        <Button color="primary" onClick={handleReview} value={uid}>
          review
        </Button>
        <Button color="secondary" onClick={handleOpen(uid)}>
          delete
        </Button>
      </ButtonGroup>
    )
  }

  const handleClose = () => {
    setDeletePopInfo(0)
  }

  const deleteUser = () => {
    api.deleteUser({ uid: deletePopInfo }).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        toast.warning('😢 you actually deleted somebody!')
        reload()
        handleClose()
      }
    })
  }

  const deleteAnswers = () => {
    api.deleteAnswers({ uid: deletePopInfo }).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        toast.warning("😢 you actually deleted somebody's progress!")
        handleClose()
      }
    })
  }

  const onSearchUser = e => {
    setFilterUserName(e.currentTarget.value)
  }

  const toolBar = () => {
    return (
      <div className={classes.toolBar}>
        <Box display="flex" justifyContent="flex-end">
          <Button color="primary" variant="contained">
            Export Data
          </Button>
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search user"
                  variant="outlined"
                  value={filterUserName}
                  onChange={onSearchUser}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    )
  }

  return (
    <>
      {toolBar()}
      <Card className={clsx(classes.root, className)} {...rest}>
        <Box minWidth={1050}>
          <Table
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              ...rowSelection
            }}
            columns={columns}
            dataSource={users.filter(value => {
              return value.name.toLowerCase().search(filterUserName.toLowerCase()) !== -1
            })}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `Total ${total} Users`
            }}
          />
          <Dialog open={!!deletePopInfo} onClose={handleClose}>
            <DialogTitle>Are you sure to delete?</DialogTitle>
            <DialogContent>
              <DialogContentText>it's a dangerous move!</DialogContentText>
              <DialogContentText>If you delete an User, then all of he's progress is wiped off too!</DialogContentText>
              <DialogContentText>Delete Answers will only clear the user's progress...</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={deleteAnswers} color="secondary">
                Delete Answers
              </Button>
              <Button onClick={deleteUser} color="secondary">
                Delete User
              </Button>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Card>
    </>
  )
}

Results.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
  history: PropTypes.any
}

export default Results
