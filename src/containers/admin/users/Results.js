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
import CardContent from '@material-ui/core/CardContent'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import SvgIcon from '@material-ui/core/SvgIcon'
import TextField from '@material-ui/core/TextField'
import CheckIcon from '@material-ui/icons/Check'
import { Search as SearchIcon } from 'react-feather'
import downloadFile from 'utils/download'

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  toolBar: {
    marginBottom: theme.spacing(1)
  }
}))

const columns = [
  { title: 'Name', dataIndex: 'name', render: undefined },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Chinese Class', dataIndex: 'chinese_class' },
  { title: 'HSK Level', dataIndex: 'hks_level' },
  { title: 'Ethnic Background', dataIndex: 'ethnic_background' },
  {
    title: 'CN-relation',
    dataIndex: 'has_chinese_acquaintance',
    render: has => {
      return has ? <CheckIcon style={{ color: 'green' }} /> : ''
    }
  },
  {
    title: 'Acquaintance Detail',
    dataIndex: 'acquaintance_detail'
  },
  {
    title: 'RegisteredAt',
    dataIndex: 'created_at',
    render: time => {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  { title: 'Operation', dataIndex: 'id', render: undefined, fixed: 'right' }
]
const rowSelection = {
  getCheckboxProps: user => ({
    uid: user.id
  })
}

const Results = ({ className, users, papers, reload, history, ...rest }) => {
  const classes = useStyles()
  const [filterUserName, setFilterUserName] = useState('')
  const [deletePopInfo, setDeletePopInfo] = useState(0) // 只需要uid就可以了
  const [reviewPopInfo, setReviewPopInfo] = useState(null) // {pid:0, uid:0}
  const [reviewPapers, setReviewPapers] = useState([]) // [paper]
  const [exportPopup, setExportPopup] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([]) // [uid]
  const [exportPaperId, setExportPaperId] = useState(0) // paper_id
  const [ext, setExt] = useState('csv') // csv or xlsx
  const [selectedOnly, setSelectedOnly] = useState(false)

  const handleReviewOpen = user => () => {
    setReviewPapers(user.papers)
    setReviewPopInfo({ uid: user.id })
  }

  const handleReview = () => {
    history.push('/admin/users/' + (reviewPopInfo.pid || reviewPapers[0].pid) + '/' + reviewPopInfo.uid)
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
  columns[columns.length - 1].render = (uid, user) => (
    <ButtonGroup size="small">
      <Button color="primary" onClick={handleReviewOpen(user)} disabled={user.papers.length <= 0}>
        review
      </Button>
      <Button color="secondary" onClick={handleOpen(uid)}>
        delete
      </Button>
    </ButtonGroup>
  )

  const handleChange = e => {
    setReviewPopInfo({ uid: reviewPopInfo.uid, pid: e.target.value })
  }

  const handleClose = () => {
    setDeletePopInfo(0)
    setReviewPopInfo(null)
    setExportPopup(false)
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

  const onClickExport = table => () => {
    const req = { table: table, ext: ext, paper_id: Number(exportPaperId) }
    if (!!selectedUsers && selectedOnly) {
      req['ids'] = selectedUsers
    }
    api.exportData(req).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        downloadFile(res)
      }
    })
  }

  const renderExportPopup = () => {
    if (exportPaperId === 0 && papers.length > 0) {
      setExportPaperId(papers[papers.length - 1].id)
    }
    return (
      <Dialog open={!!exportPopup} onClose={handleClose}>
        <DialogTitle>Ready to export data?</DialogTitle>
        <DialogContent style={{ marginBottom: 30 }}>
          <DialogContentText>export csv for less network bandwidth consumption...</DialogContentText>
          <Box display="flex">
            <Box marginRight={5} width={'40%'}>
              <InputLabel>select paper</InputLabel>
              <Select
                native
                fullWidth
                value={exportPaperId}
                onChange={e => {
                  setExportPaperId(e.currentTarget.value)
                }}
                input={<Input id="export-select-paper" />}
              >
                {papers.map(paper => (
                  <option key={paper.id} value={paper.id}>
                    {paper.name}
                  </option>
                ))}
              </Select>
            </Box>
            <Box width={'40%'}>
              <InputLabel>select Extension</InputLabel>
              <Select
                native
                fullWidth
                value={ext}
                onChange={e => {
                  setExt(e.currentTarget.value)
                }}
                input={<Input id="export-select-paper" />}
              >
                <option value="csv">csv</option>
                <option value="xlsx">xlsx</option>
              </Select>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickExport('user')} color="primary">
            Export Users
          </Button>
          <Button onClick={onClickExport('answer')} color="primary">
            Export Answers
          </Button>
          <Button onClick={handleClose} color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const toolBar = () => {
    return (
      <div className={classes.toolBar}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setExportPopup(true)
              setSelectedOnly(true)
            }}
            disabled={selectedUsers.length <= 0}
          >
            Export Selected
          </Button>
          <Button
            style={{ marginLeft: 12 }}
            color="primary"
            variant="contained"
            onClick={() => {
              setExportPopup(true)
              setSelectedOnly(false)
            }}
          >
            Export All
          </Button>
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  size="small"
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

  const onSelect = (record, selected, selectedRows) => {
    setSelectedUsers(selectedRows.map(user => user.id))
  }

  const onSelectAll = (selected, selectedRows) => {
    setSelectedUsers(selectedRows.map(user => user.id))
  }

  return (
    <>
      {toolBar()}
      <Card className={clsx(classes.root, className)} {...rest}>
        <Box>
          <Table
            size="small"
            scroll={{ x: true }}
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
              onSelect: onSelect,
              onSelectAll: onSelectAll
            }}
            columns={columns}
            dataSource={users.filter(value => {
              return value.name.toLowerCase().search(filterUserName.toLowerCase()) !== -1
            })}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `Total ${total} Users`
            }}
          />
          {renderExportPopup()}
          <Dialog open={!!deletePopInfo} onClose={handleClose}>
            <DialogTitle>Are you sure to delete?</DialogTitle>
            <DialogContent>
              <DialogContentText>it's a dangerous move!</DialogContentText>
              <DialogContentText>If you delete an User, then all of his progress is wiped off too!</DialogContentText>
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
          <Dialog disableBackdropClick disableEscapeKeyDown open={!!reviewPopInfo} onClose={handleClose}>
            <DialogTitle>Select Paper</DialogTitle>
            <DialogContent>
              <InputLabel>paper</InputLabel>
              <Select
                native
                fullWidth
                value={!!reviewPopInfo ? reviewPopInfo.pid : 0}
                onChange={handleChange}
                input={<Input id="demo-dialog-native" />}
              >
                {!!reviewPapers ? (
                  reviewPapers.map(paper => (
                    <option key={paper.pid} value={paper.pid}>
                      {paper.p_name}
                    </option>
                  ))
                ) : (
                  <option aria-label="None" value="" />
                )}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleReview} color="primary">
                Ok
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
  papers: PropTypes.array.isRequired,
  history: PropTypes.any
}

export default Results
