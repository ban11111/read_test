import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  ButtonGroup,
  Button
} from '@material-ui/core'
import getInitials from 'utils/getInitials'

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}))

const Results = ({ className, users, history, ...rest }) => {
  const classes = useStyles()
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([])
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)

  const handleSelectAll = event => {
    let newSelectedCustomerIds

    if (event.target.checked) {
      newSelectedCustomerIds = users.map(customer => customer.id)
    } else {
      newSelectedCustomerIds = []
    }

    setSelectedCustomerIds(newSelectedCustomerIds)
  }

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id)
    let newSelectedCustomerIds = []

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id)
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1))
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      )
    }

    setSelectedCustomerIds(newSelectedCustomerIds)
  }

  const handleLimitChange = event => {
    setLimit(event.target.value)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleReview = e => {
    history.push('/admin/users/' + e.currentTarget.value)
  }

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === users.length}
                    color="primary"
                    indeterminate={selectedCustomerIds.length > 0 && selectedCustomerIds.length < users.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Chinese Class</TableCell>
                <TableCell>HKS Level</TableCell>
                <TableCell>Ethnic Background</TableCell>
                <TableCell>Exam Result</TableCell>
                <TableCell>RegisteredAt</TableCell>
                <TableCell align="center">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, limit).map(user => (
                <TableRow hover key={user.id} selected={selectedCustomerIds.indexOf(user.id) !== -1}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(user.id) !== -1}
                      onChange={event => handleSelectOne(event, user.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box alignItems="center" display="flex">
                      <Avatar className={classes.avatar}>{getInitials(user.name)}</Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.chinese_class}</TableCell>
                  <TableCell>{user.hks_level}</TableCell>
                  <TableCell>{user.ethnic_background}</TableCell>
                  <TableCell>{'这里展示做过哪些试卷？'}</TableCell>
                  <TableCell>{moment(user.createdAt).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup size="small">
                      <Button color="primary" onClick={handleReview} value={user.id}>
                        review
                      </Button>
                      <Button color="secondary">delete</Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={users.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  )
}

Results.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
  history: PropTypes.any
}

export default Results
