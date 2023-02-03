import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
//import AppBar from '@mui/material/AppBar';
//import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
//import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
//import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import { AddCircleOutlineOutlined, SubjectOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
// ==============================|| MAIN LAYOUT ||============================== //

const drawerWidth = 160;

export default function ClippedDrawer() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'My Jobs',
      icon: <SubjectOutlined color="secondary" />,
      path: '/dashboard/jobs'
    },
    {
      text: 'New Job',
      icon: <AddCircleOutlineOutlined color="secondary" />,
      path: '/dashboard/jobs/new'
    },
    {
      text: 'Users',
      icon: <PeopleIcon color="secondary" />,
      path: '/dashboard/users'
    }
  ];
  return (
    <Container>
      <Box sx={{ mb: 9 }}>
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
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      backgroundColor: location.pathname === item.path ? '#efefef' : null
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText>{item.text}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
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
  );
}
