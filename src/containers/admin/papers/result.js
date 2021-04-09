import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  ButtonGroup,
  Button
} from '@material-ui/core'
import Editor from './editor/editor'

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}))

const Results = ({ className, datas, refreshPaper, ...rest }) => {
  const classes = useStyles()
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([])
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)
  const [editProps, setEditProps] = useState({ open: false, refreshPaper: refreshPaper })

  const handleSelectAll = event => {
    let newSelectedCustomerIds

    if (event.target.checked) {
      newSelectedCustomerIds = datas.map(customer => customer.id)
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

  const onClickEditExit = () => {
    setEditProps({ open: false })
  }

  const handleEditClicked = e => {
    const dataIndex = e.currentTarget.value
    setEditProps({ open: true, onClickExit: onClickEditExit, data: datas[dataIndex], refreshPaper: refreshPaper })
  }

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Editor {...editProps} />
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === datas.length}
                    color="primary"
                    indeterminate={selectedCustomerIds.length > 0 && selectedCustomerIds.length < datas.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Id</TableCell>
                <TableCell>CreatedAt</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Interval(/s)</TableCell>
                <TableCell>Words</TableCell>
                <TableCell align="center">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.slice(0, limit).map((data, index) => (
                <TableRow hover key={data.id} selected={selectedCustomerIds.indexOf(data.id) !== -1}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(data.id) !== -1}
                      onChange={event => handleSelectOne(event, data.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{moment(data.created_at).format('YYYY-MM-DD hh:mm:ss')}</TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.interval}</TableCell>
                  <TableCell>{data.words}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup size="small">
                      <Button color="primary" onClick={handleEditClicked} value={index}>
                        edit
                      </Button>
                      <Button color="primary">publish</Button>
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
        count={datas.length}
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
  datas: PropTypes.array.isRequired
}

export default Results
