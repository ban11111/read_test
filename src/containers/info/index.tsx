import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import HeadsetMicOutlinedIcon from '@material-ui/icons/HeadsetMicOutlined'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

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

export default function InfoPage(props: any) {
  const classes = useStyles()

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
        <Typography component="h3" variant="subtitle1" style={{ color: 'grey' }}>
          Instructions: xxxx
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoComplete="name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="chineseClass"
                label="Chinese Class"
                name="chineseClass"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="hksLevel" label="HKS Level" name="hksLevel" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="ethnicBackground"
                label="Ethnic Background"
                name="ethnicBackground"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            {/*<Grid item xs={12}>*/}
            {/*  <FormControlLabel*/}
            {/*    control={<Checkbox value="allowExtraEmails" color="primary" />}*/}
            {/*    label="I want to receive inspiration, marketing promotions and updates via email."*/}
            {/*  />*/}
            {/*</Grid>*/}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => {
              console.log('hook props', props)
              props.history.push('/demo')
            }}
          >
            Sign Up / Start ?
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Button
        onClick={() => {
          props.history.push('/admin/login')
        }}
      >
        临时转到 管理员Login 页面
      </Button>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}
