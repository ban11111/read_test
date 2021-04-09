import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import api from '../../../api'
import { toast } from 'react-toastify'

const useStyles = makeStyles({
  root: {}
})

const defaultSettings = {
  BitRate: 128,
  SampleRate: 16000
}

const SettingsContent = ({ className, ...rest }) => {
  const classes = useStyles()
  const [settings, setSettings] = useState(defaultSettings)
  const [updated, setUpdated] = useState(false)
  const [popOpen, setPopOpen] = useState(false)

  const handleOpen = () => {
    setPopOpen(true)
  }
  const handleClose = () => {
    setPopOpen(false)
  }

  const handleChange = event => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.value
    })
  }

  const getSetting = () => {
    api.querySettings().then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        setSettings(res.data)
      }
    })
  }

  const updateSetting = () => {
    api.updateSetting(settings).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        toast.success('🎉 YAY, you did it! ✨')
        setUpdated(prevState => !prevState)
      }
    })
  }

  const resetSetting = () => {
    api.updateSetting(defaultSettings).then(res => {
      if (!res.success) {
        toast.error(res.info)
      } else {
        toast.success('🎉 YAY, you did it! ✨')
        setUpdated(prevState => !prevState)
        handleClose()
      }
    })
  }

  useEffect(() => {
    getSetting()
  }, [updated])

  return (
    <form className={clsx(classes.root, className)} {...rest}>
      <Card>
        <CardHeader subheader="tune audio config" title="Audio Config" />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={4}>
              <InputLabel>SampleRate</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="SampleRate"
                fullWidth
                value={settings.SampleRate}
                onChange={handleChange}
              >
                <MenuItem value={8000}>8000</MenuItem>
                <MenuItem value={11025}>11025</MenuItem>
                <MenuItem value={16000}>16000</MenuItem>
                <MenuItem value={22050}>22050</MenuItem>
                <MenuItem value={24000}>24000</MenuItem>
                <MenuItem value={44100}>44100</MenuItem>
                <MenuItem value={48000}>44100</MenuItem>
                <MenuItem value={50000}>50000</MenuItem>
                <MenuItem value={96000}>96000</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <InputLabel>BitRate</InputLabel>
              <TextField
                name="BitRate"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                variant="standard"
                value={settings.BitRate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        {/*justifyContent="flex-end"*/}
        <Box display="flex" justifyContent="space-between" p={2}>
          <Button color="secondary" variant="contained" onClick={handleOpen}>
            Reset
          </Button>
          <Button color="primary" variant="contained" onClick={updateSetting}>
            Update
          </Button>
          <Dialog
            open={popOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Do you confirm to proceed the reset?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The default value of SampleRate is 16000, BitRate is 128.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={resetSetting} color="primary">
                Ok
              </Button>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Card>
    </form>
  )
}

SettingsContent.propTypes = {
  className: PropTypes.string
}

export default SettingsContent
