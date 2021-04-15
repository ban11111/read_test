import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Avatar from '@material-ui/core/Avatar'
import HeadsetMicOutlinedIcon from '@material-ui/icons/HeadsetMicOutlined'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import api from 'api'
import { toast } from 'react-toastify'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.light
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3)
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  })
)

interface LoginInfo {
  username: string
  password: string
}

type label = 'username' | 'password'

const Login = (props: any) => {
  const classes = useStyles()
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: ''
  })

  const onEdit = (l: label) => (e: ChangeEvent<HTMLInputElement>) => {
    const newUserInfo: LoginInfo = loginInfo
    newUserInfo[l] = e.currentTarget.value
    setLoginInfo(newUserInfo)
  }

  const login = () => {
    api.adminLogin(loginInfo, res => {
      if (!res.success) {
        sessionStorage.removeItem('token')
        toast.error('🚀' + res.info)
      } else {
        sessionStorage.setItem('token', res.data.token)
        props.history.push('/admin/dashboard')
      }
    })
  }

  const onPressEnter = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      login()
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <HeadsetMicOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <Box className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={onEdit('username')}
              >
                {loginInfo.username}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                autoComplete="password"
                onChange={onEdit('password')}
                onKeyDown={onPressEnter}
              >
                {loginInfo.username}
              </TextField>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
          >
            login
          </Button>
        </Box>
      </div>
    </Container>
  )
}

export default Login
