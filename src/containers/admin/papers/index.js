import React, { useState } from 'react'
import { Box, Button, Container, makeStyles, Typography } from '@material-ui/core'
import { data } from './data'
import Page from 'components/Page'
// import { DataGrid } from '@material-ui/data-grid'
import Result from './result'
import Editor from './editor/editor'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const Papers = () => {
  const classes = useStyles()
  const [papers] = useState(data)
  const [addNew, setAddNew] = useState(false)

  const Add = () => {
    setAddNew(true)
  }

  const onClickX = () => {
    setAddNew(false)
  }

  return (
    <Page className={classes.root} title="Papers">
      <Container maxWidth={false}>
        <Editor open={addNew} onClickExit={onClickX} />
        <Box display="flex" justifyContent="flex-end">
          <Button color="primary" variant="contained" onClick={Add}>
            Add New Paper
          </Button>
        </Box>
        <Box>
          <Typography color="textPrimary" variant="h5">
            Current Paper: 这里显示当前生效试卷， ui待定
          </Typography>
        </Box>
        <Box mt={3}>
          <Result datas={papers} />
        </Box>
      </Container>
    </Page>
  )
}

export default Papers
