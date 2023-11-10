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
import { useState, useEffect } from 'react'
import { Box } from '@mui/system'
import useAuth from 'hooks/useAuth'
import LogOut from 'features/auth/LogOut'
// import FortIcon from '@mui/icons-material/Fort'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router'

const Header = () => {
  const [time, setTime] = useState('')
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
  const [anchorElUser, setAnchorElUser] = useState(null)

  // const date = new Date()

  // const today = new Intl.DateTimeFormat('en-US', {
  //   dateStyle: 'full',
  //   timeStyle: 'short'
  // }).format(date)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date()

      const today = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      }).format(date)

      setTime(today)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          color="secondary"
        >
          <Toolbar sx={{ m: 0 }}>
            {/* <FortIcon
                sx={{ m: 1, p: 0, alignItems: 'center', alignContent: 'center' }}
              /> */}
            <Typography
              variant="h3"
              noWrap
              component="a"
              href="/welcome"
              sx={{
                display: 'flex-grow',
                fontFamily: 'monospace',
                fontWeight: 900,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none'
                // alignItems: 'center',
                // alignContent: 'center'
              }}
            >
              BilboMD
            </Typography>

            <Typography variant="h5" sx={{ display: { xs: 'none', sm: 'flex' }, ml: 8 }}>
              {time}
            </Typography>

            <Typography
              variant="h5"
              sx={{ display: 'flex', flexGrow: '8', justifyContent: 'flex-end', mx: 2 }}
            >
              {status}: {username}
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
    </>
  )
}

export default Header
