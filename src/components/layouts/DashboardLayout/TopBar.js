import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { AppBar, Box, Hidden, IconButton, Toolbar, makeStyles, Tooltip } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'
import Logo from 'components/Logo'

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  }
}))

const TopBar = ({ className, onMobileNavOpen, history, ...rest }) => {
  const classes = useStyles()

  const logout = () => {
    sessionStorage.removeItem('token')
    history.push('/admin/login')
  }

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Tooltip title="Logout" aria-label="logout">
          <IconButton color="inherit" onClick={logout}>
            <InputIcon />
          </IconButton>
        </Tooltip>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
}

export default TopBar
