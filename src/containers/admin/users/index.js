import React, { useEffect, useState } from 'react'
import { Box, Container, makeStyles } from '@material-ui/core'
import Page from 'components/Page'
import Results from './Results'
import api from '../../../api'
import { toast } from 'react-toastify'
import { Spin } from 'antd'
import { antIcon } from 'utils/spinIcon'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}))

const Users = props => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [papers, setPapers] = useState([])
  const [spin, setSpin] = useState(true)

  const getUsers = () => {
    api.QueryUsers().then(res => {
      setSpin(false)
      if (!res.success) {
        toast.error(res.info)
      } else {
        setUsers(res.data)
      }
    })
  }

  const getPapers = () => {
    api.queryPapers().then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        setPapers(res.data.papers)
      }
    })
  }

  const getAllInfo = () => {
    getPapers()
    getUsers()
  }

  useEffect(() => {
    getAllInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page className={classes.root} title="Customers">
      <Container maxWidth={false}>
        <Box mt={3} style={{ minWidth: 600 }}>
          {/*// todo dont use another page, use sub component */}
          <Spin indicator={antIcon} spinning={spin}>
            <Results users={users} papers={papers} reload={getAllInfo} history={props.history} />
          </Spin>
        </Box>
      </Container>
    </Page>
  )
}

export default Users
