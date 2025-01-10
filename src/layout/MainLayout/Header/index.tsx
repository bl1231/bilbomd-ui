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
import { useState } from 'react'
import useAuth from 'hooks/useAuth'
import LogOut from 'features/auth/LogOut'
import NightModeToggle from 'components/NightModeToggle'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import nerscLogo from 'assets/nersc-logo.png'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

// interface Config {
//   useNersc?: string
//   mode?: string
//   deploySite?: string
// }

interface UserMenuProps {
  anchorElUser: HTMLElement | null
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void
  handleCloseUserMenu: () => void
  settings: { text: string; onclick: () => void }[]
}

const UserMenu = ({
  anchorElUser,
  handleOpenUserMenu,
  handleCloseUserMenu,
  settings
}: UserMenuProps) => (
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

interface DeploySiteProps {
  deploySite: string
}

const DeploySite = ({ deploySite }: DeploySiteProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
    {deploySite === 'nersc' && (
      <img src={nerscLogo} alt='NERSC Logo' style={{ height: '30px' }} />
    )}
    {deploySite === 'local' && (
      <Typography variant='h5' component='span' sx={{ ml: 1 }}>
        LOCAL
      </Typography>
    )}
    {deploySite === 'bl1231' && (
      <Typography variant='h5' component='span' sx={{ ml: 1, pb: 0 }}>
        BL12.3.1
      </Typography>
    )}
  </Box>
)

interface DevModeProps {
  mode: string
}

const DevMode = ({ mode }: DevModeProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
    {mode === 'development' && (
      <Typography
        variant='h5'
        component='span'
        sx={{ ml: 1, pb: 0, color: 'yellow' }}
      >
        DEVELOPMENT
      </Typography>
    )}
  </Box>
)

const Header = () => {
  const navigate = useNavigate()
  const { username, status } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null)

  const settings = [
    { text: 'My Jobs', onclick: () => navigate('dashboard/jobs') },
    { text: 'Account', onclick: () => navigate('dashboard/account') },
    { text: 'Dashboard', onclick: () => navigate('welcome') }
  ]

  const {
    data: config,
    isLoading: configIsLoading,
    error: configError
  } = useGetConfigsQuery('configData')

  if (configIsLoading) return <CircularProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration data</Alert>
  if (!config)
    return <Alert severity='warning'>No configuration data available</Alert>

  const mode = config.mode || ''
  const deploySite = config.deploySite || ''

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
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
    letterSpacing: '.3rem',
    background: 'linear-gradient(to top, #00c9ff, #92fe9d)', // Blue to Light Green
    WebkitBackgroundClip: 'text', // Ensures gradient is applied only to the text
    WebkitTextFillColor: 'transparent', // Makes the text transparent so gradient shows
    color: 'transparent', // Fallback for other browsers
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
          <Toolbar sx={{ display: 'flex', alignItems: 'center', m: 0 }}>
            {/* Left Side: Logo and Mode Display */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
              <Link to='/welcome' style={linkStyles}>
                BilboMD
              </Link>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexGrow: 1,
                pt: 1.5
              }}
            >
              <DeploySite deploySite={deploySite} />
              <DevMode mode={mode} />
            </Box>

            {/* Right Side: Night Mode Toggle, User Info, and Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NightModeToggle sx={{ mr: 2 }} />
              <Typography
                variant='h5'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
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
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default Header
