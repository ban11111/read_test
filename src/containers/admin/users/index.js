import React, { useEffect, useState } from 'react'
import { Box, Container, makeStyles } from '@material-ui/core'
import Page from 'components/Page'
import Results from './Results'
import api from '../../../api'
import { toast } from 'react-toastify'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const Users = props => {
  const classes = useStyles()
  const [users, setUsers] = useState([])

  const getUsers = () => {
    api.QueryUsers().then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        setUsers(res.data)
      }
    })
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <Page className={classes.root} title="Customers">
      <Container maxWidth={false}>
        <Box mt={3} style={{ minWidth: 1099 }}>
          {/*// todo dont use another page, use sub component */}
          <Results users={users} reload={getUsers} history={props.history} />
        </Box>
      </Container>
    </Page>
  )
}

export default Users
