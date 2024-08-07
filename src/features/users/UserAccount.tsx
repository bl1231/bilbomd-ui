import { useState } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import EditProfileForm from './EditProfileForm';
import ForgotPasswordForm from './../auth/ForgotPasswordForm';
import ResetPasswordForm from './../auth/ResetPasswordForm';
import useAuth from 'hooks/useAuth';

const UserAccount = () => {
  const [accountView, setAccountView] = useState('profile'); // 'profile', 'forgotPassword', 'resetPassword'
  
  const { username, isManager, isAdmin,email } = useAuth()

  const [user, setUser] = useState({
    email: email,
    username:username,
  });
  const handleForgotPasswordSubmit = (email) => {
    console.log('Requesting password reset for email:', email);
  };

  const handleResetPasswordSubmit = (password) => {
    console.log('Resetting password to:', password);
  };

  const renderView = () => {
    switch (accountView) {
      case 'forgotPassword':
        return <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} />;
      case 'resetPassword':
        return <ResetPasswordForm onSubmit={handleResetPasswordSubmit} />;
      default:
        return (
          <Box>
            <Typography variant="h2" gutterBottom>Account Information</Typography>
            <Typography gutterBottom>Email: {user.email}</Typography>
            <Typography gutterBottom>Username: {user.username}</Typography>
            <Box mt={2}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setAccountView('forgotPassword')}
              >
                Forgot Password
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setAccountView('resetPassword')}
                sx={{ ml: 2 }}
              >
                Reset Password
              </Button>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {/* <EditProfileForm/> */}
        {renderView()}
      </Grid>
    </Grid>
  );
};

export default UserAccount;
