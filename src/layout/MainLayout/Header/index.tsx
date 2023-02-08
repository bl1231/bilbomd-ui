import {
  AppBar,
  Avatar,
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  IconButton
} from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
//import { selectCurrentUser } from 'features/auth/authSlice'
import { authApiSlice, useSendLogoutMutation } from 'features/auth/authApiSlice'
import { Link } from 'react-router-dom'
import { Box } from '@mui/system'
import useAuth from 'hooks/useAuth'
import AdbIcon from '@mui/icons-material/Adb'
import FortIcon from '@mui/icons-material/Fort'

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const Header = () => {
  const { username, status } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()
  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long'
  }).format(date)
  const logoutButton = (
    <Button
      variant="contained"
      onClick={sendLogout}
      sx={{ mr: 2 }}
    >
      Logout
    </Button>
  )
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        color="secondary"
      >
        <Toolbar>
          <FortIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h3"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            BilboMD
          </Typography>

          {logoutButton}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                <Avatar
                  alt="Your Avatar"
                  src="/static/images/avatar/2.jpg"
                />
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
                <MenuItem
                  key={setting}
                  onClick={handleCloseUserMenu}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography>{username} </Typography>
          <Typography>{status} </Typography>
          <Typography>{today} </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
