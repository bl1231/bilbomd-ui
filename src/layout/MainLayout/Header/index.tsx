import { AppBar, Toolbar, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/auth/authSlice';

const Header = () => {
  const user = useSelector(selectCurrentUser);
  return (
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
        <Typography>{user}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
