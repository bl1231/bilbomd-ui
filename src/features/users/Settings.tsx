import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar
} from '@mui/material'
import UserAvatar from './UserAvatar'
import { useNavigate, Outlet, useLocation } from 'react-router'
import useAuth from 'hooks/useAuth'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import EmailIcon from '@mui/icons-material/Email'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import ApiIcon from '@mui/icons-material/Api'

const drawerWidth = 190

const settingsMenu = [
  {
    text: 'Preferences',
    path: '/settings/preferences',
    icon: <ManageAccountsIcon />
  },
  {
    text: 'Email and Security',
    path: '/settings/security',
    icon: <EmailIcon />
  },
  {
    text: 'Safety Zone',
    path: '/settings/safety',
    icon: <HealthAndSafetyIcon />
  },
  { text: 'API Tokens', path: '/settings/api-tokens', icon: <ApiIcon /> }
]

const SettingsLayout = () => {
  const user = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '24px' // offset for fixed Header
          }
        }}
      >
        <Toolbar />
        <UserAvatar
          username={user.username}
          email={user.email}
          status={user.status}
        />
        <List>
          {settingsMenu.map(({ text, path, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={
                  location.pathname === path ||
                  (path === '/settings/preferences' &&
                    location.pathname === '/settings')
                }
                onClick={() => navigate(path)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default SettingsLayout
