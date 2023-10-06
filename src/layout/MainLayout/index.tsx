import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import PeopleIcon from '@mui/icons-material/People'
import {
  AddCircleOutlineOutlined,
  SubjectOutlined,
  AutoAwesome
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'
import { Outlet, useLocation } from 'react-router-dom'

import useAuth from 'hooks/useAuth'

import Header from './Header'
import Footer from './Footer'
// ==============================|| MAIN LAYOUT ||============================== //

const drawerWidth = 160

export default function ClippedDrawer() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      text: 'Jobs',
      icon: <SubjectOutlined color="secondary" />,
      path: '/dashboard/jobs',
      onclick: () => navigate('dashboard/jobs'),
      roles: ['user', 'manager']
    },
    {
      text: 'New Job',
      icon: <AddCircleOutlineOutlined color="secondary" />,
      path: '/dashboard/jobs/new',
      onclick: () => navigate('dashboard/jobs/new'),
      roles: ['user', 'manager']
    },
    {
      text: 'New Auto Job',
      icon: <AddCircleOutlineOutlined color="secondary" />,
      path: '/dashboard/jobs/simple',
      onclick: () => navigate('dashboard/jobs/simple'),
      roles: ['user', 'manager']
    },
    {
      text: 'Inp Jiffy',
      icon: <AutoAwesome color="secondary" />,
      path: '/dashboard/jobs/constinp',
      onclick: () => navigate('dashboard/jobs/constinp'),
      roles: ['user', 'manager']
    },
    {
      text: 'PAE Jiffy',
      icon: <AutoAwesome color="secondary" />,
      path: '/dashboard/af2pae',
      onclick: () => navigate('dashboard/af2pae'),
      roles: ['user']
    },
    {
      text: 'Users',
      icon: <PeopleIcon color="secondary" />,
      path: '/dashboard/users',
      onclick: () => navigate('dashboard/users'),
      roles: ['admin']
    }
  ]

  const buttonContent = (
    <>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            onClick={item.onclick}
            sx={{
              backgroundColor: location.pathname === item.path ? '#efefef' : null,
              display: item.roles.includes('admin') && !isAdmin ? 'none' : 'flex'
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
    <Container>
      <Box sx={{ display: 'flex', width: '100%', mb: 7 }}>
        <Header />
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
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

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
          <Toolbar />
        </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Footer />
      </Box>
    </Container>
  )

  return content
}
