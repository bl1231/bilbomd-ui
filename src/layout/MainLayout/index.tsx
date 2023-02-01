import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
//import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import { AddCircleOutlineOutlined, SubjectOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectCurrentToken
} from 'store/reducers/authSlice';
// ==============================|| MAIN LAYOUT ||============================== //

const drawerWidth = 140;

export default function ClippedDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  //const logout = useLogout();
  // const signOut = async () => {
  //   await logout();
  //   navigate('/');
  // };
  const menuItems = [
    {
      text: 'My Jobs',
      icon: <SubjectOutlined color="secondary" />,
      path: '/jobs'
    },
    {
      text: 'New Job',
      icon: <AddCircleOutlineOutlined color="secondary" />,
      path: '/job'
    },
    {
      text: 'Logout',
      icon: <LogoutIcon color="secondary" />,
      path: ''
    }
  ];
  return (
    <Container>
      <Box sx={{ mb: 9 }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          color="secondary"
        >
          <Toolbar>
            <Typography variant="h3" component="h1">
              BilboMD
            </Typography>
            {/* <Typography>{format(new Date(), 'do MMMM Y')}</Typography>
            <Typography>Scott</Typography>
            <Avatar src="/me.png" />

            <Button color="inherit">Login</Button> */}
            <Typography>{user}</Typography>
          </Toolbar>
        </AppBar>
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
                      backgroundColor:
                        location.pathname === item.path ? '#efefef' : null
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
    </Container>
  );
}
