import React, { ChangeEvent, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import HeadsetMicOutlinedIcon from '@material-ui/icons/HeadsetMicOutlined'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import api from 'api'
import { toast } from 'react-toastify'
import { KeyUserInfo, storageSet } from 'global/storage'

// 本页面逻辑, 先登录(只用填email), 如果账户不存在则展示注册逻辑

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

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

interface UserInfo {
  email: string // 先简单粗暴, 直接用email当做唯一识别字段
  name: string
  chinese_class: string
  hks_level: string
  ethnic_background: string
}

type label = 'email' | 'name' | 'chinese_class' | 'hks_level' | 'ethnic_background'

export default function InfoPage(props: any) {
  const classes = useStyles()
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    chinese_class: '',
    hks_level: '',
    ethnic_background: ''
  })
  const [needSignUp, setNeedSignUp] = useState(false)

  const onEdit = (l: label) => (e: ChangeEvent<HTMLInputElement>) => {
    const newUserInfo: UserInfo = userInfo
    newUserInfo[l] = e.currentTarget.value
    setUserInfo(newUserInfo)
  }

  const signUp = () => {
    api.signUp(userInfo).then(resp => {
      if (!resp.success) {
        toast.error('🚀' + resp.info)
      } else {
        storageSet(KeyUserInfo, resp.data.user) // 这里后端直接回传完整用户信息
        props.history.push('/instruction')
      }
    })
  }

  const signIn = () => {
    api.signIn({ email: userInfo.email }).then(resp => {
      if (!resp.success) {
        // 根据返回值判断, 如果是用户不存在, 则转为注册页面
        toast.error('🚀' + resp.info)
      } else {
        if (resp.data.user_not_exist) {
          setNeedSignUp(true)
        } else {
          toast.info('🦄 welcome ' + resp.data.user.name)
          storageSet(KeyUserInfo, resp.data.user) // 这里后端直接回传完整用户信息
          props.history.push('/instruction')
        }
      }
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <HeadsetMicOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Chinese Character Reading Test
        </Typography>
        {/*<Typography component="h3" variant="subtitle1" style={{ color: 'grey' }}>*/}
        {/*  Instructions: xxxx*/}
        {/*</Typography>*/}
        <Box className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={onEdit('email')}
              >
                {userInfo.email}
              </TextField>
            </Grid>
            {needSignUp && (
              <>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoComplete="name"
                    onChange={onEdit('name')}
                  >
                    {userInfo.name}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="chineseClass"
                    label="Chinese Class"
                    name="chineseClass"
                    onChange={onEdit('chinese_class')}
                  >
                    {userInfo.chinese_class}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="hksLevel"
                    label="HKS Level"
                    name="hksLevel"
                    onChange={onEdit('hks_level')}
                  >
                    {userInfo.hks_level}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="ethnicBackground"
                    label="Ethnic Background"
                    name="ethnicBackground"
                    onChange={onEdit('ethnic_background')}
                  >
                    {userInfo.ethnic_background}
                  </TextField>
                </Grid>
              </>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={needSignUp ? signUp : signIn}
          >
            {needSignUp ? 'sign up' : 'sign in'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                href="/instruction"
                variant="body2"
                onClick={() => {
                  storageSet(KeyUserInfo, userInfo)
                }}
              >
                临时转到instruction页面
              </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}
