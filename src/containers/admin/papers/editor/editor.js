import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  makeStyles,
  TextField
} from '@material-ui/core'
import { toast } from 'react-toastify'
import api from 'api'
import { Input } from 'antd'

const { TextArea } = Input

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  }
}))

const Editor = props => {
  const classes = useStyles()
  const [words, setWords] = useState('') // {key:index, label:word}
  const [interval, setInterval] = useState(0)
  const [name, setName] = useState('')

  const onUpdatePaper = () => {
    api.editPaper({ ...props.data, words: words, interval: interval }).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        toast.success('updated!')
        props.refreshPaper()
        props.onClickExit()
      }
    })
  }

  const onAddPaper = () => {
    api.addPaper({ name: name, interval: interval, words: words }).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        toast.success('success!')
        props.refreshPaper()
        props.onClickExit()
      }
    })
  }

  const onClickOk = () => {
    props.type === 'add' ? onAddPaper() : onUpdatePaper()
  }

  const onUpdateInterval = e => {
    setInterval(parseInt(e.currentTarget.value))
  }

  const editWords = e => {
    setWords(e.currentTarget.value)
  }

  const editName = e => {
    setName(e.currentTarget.value)
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Dialog maxWidth="md" fullWidth open={props.open} onClose={props.onClickExit}>
          {props.type === 'edit' && (
            <DialogTitle>
              Id: {(props.data && props.data.id) || 0}; PaperName: {(props.data && props.data.name) || ''}
            </DialogTitle>
          )}
          <DialogContent className={classes.root}>
            <Grid container>
              {props.type === 'add' && (
                <>
                  <Grid item xs={2}>
                    <InputLabel>Paper Name</InputLabel>
                  </Grid>
                  <Grid item xs={10} style={{ marginBottom: 20 }}>
                    <TextField variant="standard" onChange={editName} />
                  </Grid>
                </>
              )}
              <Grid item xs={2}>
                <InputLabel>Interval (per/s)</InputLabel>
              </Grid>
              <Grid item xs={10} style={{ marginBottom: 20 }}>
                <TextField
                  type="number"
                  variant="standard"
                  defaultValue={props.data && props.data.interval}
                  onChange={onUpdateInterval}
                />
              </Grid>
              <Grid item xs={2}>
                <InputLabel>Words</InputLabel>
              </Grid>
              <Grid item xs={10}>
                <TextArea
                  placeholder="you can edit words here"
                  autoSize
                  defaultValue={props.data && props.data.words}
                  onChange={editWords}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClickOk} color="primary">
              Ok
            </Button>
            <Button onClick={props.onClickExit} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default Editor
