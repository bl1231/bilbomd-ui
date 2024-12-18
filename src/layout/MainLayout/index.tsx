import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useTheme } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import {
  AddCircleOutlineOutlined,
  SubjectOutlined,
  AutoAwesome,
  InfoOutlined
} from '@mui/icons-material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import useAuth from 'hooks/useAuth'

import Header from './Header'
import Footer from './Footer'

const drawerWidth = 170

export default function ClippedDrawer() {
  const { isAdmin } = useAuth()
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})
  // console.log(`config: ${JSON.stringify(config)}`)

  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  if (configIsLoading) return <CircularProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration data</Alert>
  if (!config)
    return <Alert severity='warning'>No configuration data available</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'
  const enableBilboMdSANS = config.enableBilboMdSANS?.toLowerCase() === 'true'
  const enableBilboMdMulti = config.enableBilboMdMulti?.toLowerCase() === 'true'

  let menuItems = [
    {
      text: 'Jobs',
      icon: <SubjectOutlined />,
      path: '/dashboard/jobs',
      onclick: () => navigate('dashboard/jobs'),
      roles: ['user', 'manager']
    },
    {
      text: 'BilboMD Classic',
      icon: <AddCircleOutlineOutlined />,
      path: '/dashboard/jobs/classic',
      onclick: () => navigate('dashboard/jobs/classic'),
      roles: ['user', 'manager']
    },
    {
      text: 'BilboMD Auto',
      icon: <AddCircleOutlineOutlined />,
      path: '/dashboard/jobs/auto',
      onclick: () => navigate('dashboard/jobs/auto'),
      roles: ['user', 'manager']
    },
    {
      text: 'BilboMD AF',
      icon: <AddCircleOutlineOutlined />,
      path: '/dashboard/jobs/alphafold',
      onclick: () => navigate('dashboard/jobs/alphafold'),
      roles: ['user', 'manager']
    },
    {
      text: 'BilboMD Multi',
      icon: <AddCircleOutlineOutlined />,
      path: '/dashboard/jobs/multimd',
      onclick: () => navigate('dashboard/jobs/multimd'),
      roles: ['user', 'manager']
    },
    {
      text: 'BilboMD SANS',
      icon: <AddCircleOutlineOutlined />,
      path: '/dashboard/jobs/sans',
      onclick: () => navigate('dashboard/jobs/sans'),
      roles: ['user', 'manager']
    },
    {
      text: 'Scoper',
      icon: <AddCircleOutlineOutlined />,
      path: '/dashboard/jobs/scoper',
      onclick: () => navigate('dashboard/jobs/scoper'),
      roles: ['user', 'manager']
    },
    {
      text: 'inp Jiffy™',
      icon: <AutoAwesome />,
      path: '/dashboard/jobs/constinp',
      onclick: () => navigate('dashboard/jobs/constinp'),
      roles: ['user', 'manager']
    },
    {
      text: 'PAE Jiffy™',
      icon: <AutoAwesome />,
      path: '/dashboard/af2pae',
      onclick: () => navigate('dashboard/af2pae'),
      roles: ['user']
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/dashboard/users',
      onclick: () => navigate('dashboard/users'),
      roles: ['admin']
    },
    {
      text: 'Admin',
      icon: <AdminPanelSettingsIcon />,
      path: '/admin',
      onclick: () => navigate('admin'),
      roles: ['admin']
    },
    {
      text: 'About',
      icon: <InfoOutlined />,
      path: '/dashboard/about',
      onclick: () => navigate('/dashboard/about'),
      roles: ['user']
    }
  ]

  if (useNersc) {
    menuItems = menuItems.filter((item) => item.text !== 'Scoper')
  }

  // if (!useNersc) {
  //   menuItems = menuItems.filter((item) => item.text !== 'BilboMD AF')
  // }

  if (!enableBilboMdSANS) {
    menuItems = menuItems.filter((item) => item.text !== 'BilboMD SANS')
  }

  if (!enableBilboMdMulti) {
    menuItems = menuItems.filter((item) => item.text !== 'BilboMD Multi')
  }

  const buttonContent = (
    <>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            onClick={item.onclick}
            sx={{
              backgroundColor:
                location.pathname === item.path
                  ? theme.palette.mode === 'light'
                    ? theme.palette.grey[200]
                    : theme.palette.grey[600]
                  : null,
              display:
                item.roles.includes('admin') && !isAdmin ? 'none' : 'flex'
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText sx={{ ml: 1 }}>{item.text}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </>
  )

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ display: 'flex', mb: 8 }}>
        <Header />
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Drawer
          variant='permanent'
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>{buttonContent}</List>
            <Divider />
            {/** add more items to the drawer  */}
          </Box>
        </Drawer>

        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
          <Toolbar />
        </Box>
      </Box>

      <Box sx={{ width: '100vw' }}>
        <Footer />
      </Box>
    </Box>
  )

  return content
}
