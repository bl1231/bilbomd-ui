import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  CssBaseline,
  CircularProgress,
  Alert,
  Box
} from '@mui/material'
import { useState, useEffect } from 'react'
import useAuth from 'hooks/useAuth'
import LogOut from 'features/auth/LogOut'
import NightModeToggle from 'components/NightModeToggle'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import nerscLogo from 'assets/nersc-logo.png'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const UserMenu = ({
  anchorElUser,
  handleOpenUserMenu,
  handleCloseUserMenu,
  settings
}) => (
  <>
    <Tooltip
      title='Open settings'
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
      id='menu-appbar'
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
          <Typography textAlign='center'>{setting.text}</Typography>
        </MenuItem>
      ))}
      <MenuItem>
        <LogOut />
      </MenuItem>
    </Menu>
  </>
)

const NerscLogo = ({ useNersc, mode }) =>
  useNersc && (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', p: 1 }}>
      <img src={nerscLogo} alt='NERSC Logo' style={{ height: '30px' }} />
      {mode === 'development' && (
        <Typography
          variant='h5'
          component='span'
          sx={{ ml: 1, pb: 0.2, color: 'yellow' }}
        >
          DEVELOPMENT
        </Typography>
      )}
    </Box>
  )

const ModeDisplay = ({ useNersc, mode }) =>
  !useNersc && (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', p: 1 }}>
      {mode !== 'local' && (
        <Typography variant='h5' component='span' sx={{ ml: 1, pb: 0.2 }}>
          BL12.3.1
        </Typography>
      )}
      {mode === 'development' && (
        <Typography
          variant='h5'
          component='span'
          sx={{ ml: 1, pb: 0.2, color: 'yellow' }}
        >
          DEVELOPMENT
        </Typography>
      )}
      {mode === 'local' && (
        <Box>
          <Typography variant='h5' component='span' sx={{ ml: 1, pb: 0.2 }}>
            LOCAL
          </Typography>
          <Typography
            variant='h5'
            component='span'
            sx={{ ml: 1, pb: 0.2, color: 'yellow' }}
          >
            DEVELOPMENT
          </Typography>
        </Box>
      )}
    </Box>
  )

const Header = () => {
  const [time, setTime] = useState('')
  const navigate = useNavigate()
  const { username, status } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState(null)

  const settings = [
    { text: 'My Jobs', onclick: () => navigate('dashboard/jobs') },
    { text: 'Account', onclick: () => navigate('dashboard/account') },
    { text: 'Dashboard', onclick: () => navigate('welcome') }
  ]

  const {
    data: config,
    isLoading: configIsLoading,
    error: configError
  } = useGetConfigsQuery({})

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

  if (configIsLoading) return <CircularProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration data</Alert>
  if (!config)
    return <Alert severity='warning'>No configuration data available</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'
  const mode = config.mode || 'nope'

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const linkStyles = {
    display: 'flex-grow',
    fontFamily: 'monospace',
    fontWeight: 900,
    fontSize: '3em',
    letterSpacing: '.2rem',
    color: 'inherit',
    textDecoration: 'none'
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position='fixed'
          elevation={0}
          sx={{ height: '70px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ m: 0 }}>
            <Link to='/welcome' style={linkStyles}>
              BilboMD
            </Link>
            <NerscLogo useNersc={useNersc} mode={mode} />
            <ModeDisplay useNersc={useNersc} mode={mode} />
            <Typography
              variant='h5'
              sx={{ display: { xs: 'none', sm: 'flex' }, ml: 8 }}
            >
              {time}
            </Typography>
            <Typography
              variant='h5'
              sx={{
                display: 'flex',
                flexGrow: 8,
                justifyContent: 'flex-end',
                mx: 2
              }}
            >
              {status}: {username}
            </Typography>
            <UserMenu
              anchorElUser={anchorElUser}
              handleOpenUserMenu={handleOpenUserMenu}
              handleCloseUserMenu={handleCloseUserMenu}
              settings={settings}
            />
            <NightModeToggle />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default Header
