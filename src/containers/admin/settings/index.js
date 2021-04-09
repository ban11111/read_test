import React from 'react'
import { Box, Container, makeStyles } from '@material-ui/core'
import Page from 'components/Page'
import SettingsContent from './Settings'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const Settings = () => {
  const classes = useStyles()

  return (
    <Page className={classes.root} title="Settings">
      <Container maxWidth="lg">
        <Box mt={3}>
          <SettingsContent />
        </Box>
      </Container>
    </Page>
  )
}

export default Settings
