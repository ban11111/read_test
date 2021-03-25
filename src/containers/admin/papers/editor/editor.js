import React from 'react'
import { Button, Container, Grid, Popover, TextareaAutosize, Typography } from '@material-ui/core'

const Editor = props => {
  return (
    <Container>
      <Popover
        open={props.open}
        // anchorEl={anchorEl}
        // onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 200, left: 400 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h5">{(props.data && props.data.name) || ''}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={props.onClickExit}>X</Button>
          </Grid>
          <Grid item xs={9}>
            <TextareaAutosize
              rowsMin={3}
              placeholder="edit words here"
              defaultValue={(props.data && props.data.words) || ''}
            />
          </Grid>
          <Grid item xs={3}>
            <Button>ok</Button>
          </Grid>
        </Grid>
      </Popover>
    </Container>
  )
}

export default Editor
