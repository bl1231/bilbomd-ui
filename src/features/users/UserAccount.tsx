
import * as React from 'react';
import { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  TextField,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLogout  from 'hooks/useLogout';
//import { ToastContainer, toast,Bounce } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';


interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

const UserAccount: React.FC = () => {
  
  const { username, email, roles } = useAuth() as User;
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };
  const logout=useLogout()
  const handleAutomaticLogout=()=>{
    logout()
  }
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleUpdateEmail = async () => {
    try {
      console.log('Updating email to:', newEmail);
      const response = await fetch('/api/v1/users/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          currentEmail: email,
          newEmail: newEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        setOtpSent(true);
        //toast.success("OTP is sent")
        setIsOtpModalOpen(true); // Open OTP modal
      } else {
        //toast.error('Error sending an OTP to your new email address')
      }
    } catch (error) {
      //toast.error('Error sending an OTP to your new email address')
    }
  };

  const handleVerifyOtp = async () => {
    // Log the OTP that is being verified
    console.log('Verifying OTP:', otp);
  
    try {
      // Make the API call to verify the OTP
      const response = await fetch('/api/v1/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          currentEmail: email,
          newEmail: newEmail,
          otp: otp,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // "Email address updated successfully"
        //toast.success('Email address updated successfully please login with new email address');
        setTimeout(handleAutomaticLogout,3000);
        setIsOtpModalOpen(false); // Close OTP modal after successful verification
      } else {
        //toast.error('Error verifying OTP');
      }
    } catch (error) {
      //toast.error('Error verifying OTP');
    }
  };
  

  const handleResendOtp = async () => {
    // Clear the OTP input field
    setOtp('');
  
    try {
      // Make the API call to resend OTP
      const response = await fetch('/api/v1/users/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          currentEmail: email,
          newEmail: newEmail,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        //toast.success("OTP sent successfully to new email address")
      } else {
        //toast.error("Error resending OTP");
      }
    } catch (error) {
      //toast.error("Error resending OTP")
    }
  
    console.log('Resending OTP to:', newEmail);
  };
  

  const handleDeleteAccount = () => {
    setIsDeleteConfirmVisible(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccountApiCall(username);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
    setIsDeleteConfirmVisible(false);
  };

  const deleteAccountApiCall = (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve();
        } else {
          reject(new Error('Failed to delete account'));
        }
      }, 1000);
    });
  };

  return (
    <>
    <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 4 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant='h6'
            sx={{
              backgroundColor: '#888',
              color: 'white',
              padding: '16px',
              borderRadius: '4px 4px 0 0',
              textTransform: 'uppercase'
            }}
            gutterBottom
          >
            User Information
          </Typography>
          <Box sx={{ p: 2 }}>
            <Typography>User Name: {username}</Typography>
            <Typography>Email Address: {email}</Typography>
            <Typography>Roles: {roles.join(', ')}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant='h6'
            sx={{
              backgroundColor: '#888',
              color: 'white',
              padding: '16px',
              borderRadius: '4px 4px 0 0',
              textTransform: 'uppercase'
            }}
            gutterBottom
          >
            Change Email Address
          </Typography>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label='New Email Address'
              variant='outlined'
              value={newEmail}
              onChange={handleNewEmailChange}
              sx={{ mb: 2 }}
              placeholder='Enter new email address'
            />
            <Button
              fullWidth
              variant='contained'
              color='primary'
              onClick={handleUpdateEmail}
            >
              Update Email
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)}>
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Enter OTP'
            variant='outlined'
            value={otp}
            onChange={handleOtpChange}
            sx={{ mt: 2 }}
            placeholder='Enter OTP'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResendOtp} variant='outlined'>
            Resend OTP
          </Button>
          <Button onClick={handleVerifyOtp} variant='contained' color='primary'>
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant='h6'
            sx={{
              backgroundColor: '#888',
              color: 'white',
              padding: '16px',
              borderRadius: '4px 4px 0 0',
              textTransform: 'uppercase'
            }}
            gutterBottom
          >
            Delete Account
          </Typography>
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant='contained'
              sx={{
                bgcolor: 'black',
                color: 'white',
                '&:hover': { bgcolor: 'grey.900' }
              }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
            {isDeleteConfirmVisible && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'pink', borderRadius: 1 }}>
                <Typography sx={{ mb: 2 }}>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant='contained'
                    color='error'
                    onClick={confirmDeleteAccount}
                    sx={{ flex: 1, mr: 1 }}
                  >
                    Confirm Deletion
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => setIsDeleteConfirmVisible(false)}
                    sx={{ flex: 1, ml: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
    </>
  );
};

export default UserAccount;
