import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Toolbar,
  Typography
} from '@mui/material'
import NightModeToggle from 'components/NightModeToggle'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import nerscLogo from 'assets/nersc-logo.png'

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

interface NerscLogoProps {
  useNersc: boolean
  mode: string
}

const NerscLogo = ({ useNersc, mode }: NerscLogoProps) =>
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

const ModeDisplay = ({ useNersc, mode }: NerscLogoProps) =>
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

  const {
    data: config,
    isLoading: configIsLoading,
    error: configError
  } = useGetConfigsQuery('configData')

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
            <Link to='/' style={linkStyles}>
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                flexGrow: 1
              }}
            >
              <Button
                variant='contained'
                to='register'
                component={Link}
                sx={{ mx: 1, borderRadius: 2 }}
              >
                Register
              </Button>
              <Button
                variant='contained'
                to='login'
                component={Link}
                sx={{ mx: 1, borderRadius: 2 }}
              >
                Login
              </Button>
              <NightModeToggle />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default Header
