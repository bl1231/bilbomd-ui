import { Container } from '@mui/system';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AddCircleOutlineOutlined, SubjectOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

// const useStyles = makeStyles((theme) => {
//   return {
//     page: {
//       background: '#f9f9f9',
//       width: '100%',
//       padding: theme.spacing(3)
//     },
//     root: {
//       display: 'flex'
//     },
//     drawer: {
//       width: drawerWidth
//     },
//     drawerPaper: {
//       width: drawerWidth
//     },
//     active: {
//       background: '#f4f4f4'
//     },
//     title: {
//       padding: theme.spacing(2)
//     },
//     appBar: {
//       width: `calc(100% - ${drawerWidth}px)`,
//       marginLeft: drawerWidth
//     },
//     date: {
//       flexGrow: 1
//     },
//     toolbar: theme.mixins.toolbar
//   };
// });

const CustomToolBar = styled('div')(({ theme }) => ({
  toolbar: theme.mixins.toolbar,
  border: '1px dashed grey'
}));

const MyThemeComponent = styled('div')(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius
}));

const Layout = () => {
  const history = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'My Jobs', icon: <SubjectOutlined color="secondary" />, path: '/dashboard' },
    {
      text: 'New Job',
      icon: <AddCircleOutlineOutlined color="secondary" />,
      path: '/job'
    }
  ];

  return (
    <Container sx={{ backgroundColor: '#f9f9f9', width: '100%', display: 'flex' }}>
      {/* app bar */}

      <AppBar sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="h1"
          >
            Welcome
          </Typography>
        </Toolbar>
      </AppBar>

      {/* side drawer */}

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <div>
          <Typography sx={{ padding: '6px' }}>BilboMD</Typography>
        </div>

        {/* list  links */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
            >
              <ListItemButton
                onClick={() => history(item.path)}
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
      </Drawer>

      {/* spacer under app bar to push contetn down */}

      {/* content */}
      <Outlet />
    </Container>
  );
};

export default Layout;
