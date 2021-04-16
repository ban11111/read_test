import React, { useState, useEffect } from 'react'
import { Box, Button, Container, makeStyles, Typography } from '@material-ui/core'
import Page from 'components/Page'
import Result from './result'
import Editor from './editor/editor'
import api from 'api'
import { toast } from 'react-toastify'

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
  const [papers, setPapers] = useState([])
  const [activePaper, setActivePaper] = useState({})
  const [addNew, setAddNew] = useState(false)

  const getPapers = () => {
    api.queryPapers().then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        setPapers(res.data.papers)
        setActivePaper(res.data.active_paper)
      }
    })
  }

  useEffect(getPapers, [])

  const Add = () => {
    setAddNew(true)
  }

  const onClickX = () => {
    setAddNew(false)
  }

  return (
    <Page className={classes.root} title="Papers">
      <Container maxWidth={false}>
        <Editor open={addNew} onClickExit={onClickX} refreshPaper={getPapers} type="add" />
        <Box display="flex" justifyContent="flex-end">
          <Button color="primary" variant="contained" onClick={Add}>
            Add New Paper
          </Button>
        </Box>
        <Box>
          <Typography color="textPrimary" variant="h5">
            Active Paper: id({activePaper.id}): {activePaper.name}
          </Typography>
        </Box>
        <Box mt={3}>
          <Result papers={papers} refreshPaper={getPapers} />
        </Box>
      </Container>
    </Page>
  )
}

export default Papers
