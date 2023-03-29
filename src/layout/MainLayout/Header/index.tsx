import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  CssBaseline
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/system'
import useAuth from 'hooks/useAuth'
import LogOut from 'features/auth/LogOut'
import FortIcon from '@mui/icons-material/Fort'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router'
// import { useSendLogoutMutation } from 'features/auth/authApiSlice'

//const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const Header = () => {
  // const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()
  const navigate = useNavigate()
  const settings = [
    {
      text: 'My Jobs',
      onclick: () => navigate('dashboard/jobs')
    },
    {
      text: 'Account',
      onclick: () => {
        navigate('dashboard/account')
      }
    },
    {
      text: 'Dashboard',
      onclick: () => navigate('welcome')
    }
  ]

  const { username, status } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const date = new Date()

  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  // useEffect(() => {
  //   if (isSuccess) navigate('/')
  // }, [isSuccess, navigate])

  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          color="secondary"
        >
          <Toolbar>
            <FortIcon sx={{ mr: 1 }} />
            <Typography
              variant="h3"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 6,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              BilboMD
            </Typography>

            <Typography variant="h5" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {today}
            </Typography>

            <Typography
              variant="h5"
              sx={{ display: 'flex', flexGrow: '8', justifyContent: 'flex-end', mx: 2 }}
            >
              {username}
            </Typography>

            <Tooltip
              title="Open settings"
              sx={{ flexGrow: 1, justifyContent: 'flex-end' }}
            >
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, flexGrow: 0, justifyContent: 'flex-end' }}
              >
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.text} onClick={setting.onclick}>
                  <Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
              <MenuItem>
                <LogOut />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
    </React.Fragment>
  )
}

export default Header
