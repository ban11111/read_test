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

  const onUpdateWords = () => {
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

  const onUpdateInterval = e => {
    setInterval(parseInt(e.currentTarget.value))
  }

  // useEffect(() => {
  //   if (props.data) {
  //     setWords(props.data.words)
  //   }
  // }, [props.data])

  const editWords = e => {
    setWords(e.currentTarget.value)
  }

  // const handleAddWord = e => {
  //   setWords(e.currentTarget.value)
  // }
  //
  // const handleDeleteWord = chipToDelete => () => {
  //   // setWords(words => words.filter((word, i) => i !== chipToDelete))
  //   setWords(words =>
  //     words
  //       .split(' ')
  //       .filter((word, i) => i !== chipToDelete)
  //       .join(' ')
  //   )
  // }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Dialog
          maxWidth="md"
          fullWidth
          open={props.open}
          onClose={props.onClickExit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Id: {(props.data && props.data.id) || 0}; PaperName: {(props.data && props.data.name) || ''}
          </DialogTitle>
          <DialogContent className={classes.root}>
            <Grid container>
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

            {/*{words.split(' ').map((word, i) => {*/}
            {/*  return (*/}
            {/*    <li key={i}>*/}
            {/*      <Chip label={word} onDelete={handleDeleteWord(i)} className={classes.chip} />*/}
            {/*    </li>*/}
            {/*  )*/}
            {/*})}*/}
            {/*<li>*/}
            {/*  <OutlinedInput className={classes.input} placeholder="Add here" />*/}
            {/*  <IconButton type="submit">*/}
            {/*    <Plus />*/}
            {/*  </IconButton>*/}
            {/*</li>*/}
          </DialogContent>
          <DialogActions>
            <Button onClick={onUpdateWords} color="primary">
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
