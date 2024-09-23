import * as React from 'react'
import { useState } from 'react'
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
  DialogTitle
} from '@mui/material'
import useAuth from 'hooks/useAuth'
import useLogout from 'hooks/useLogout'

interface User {
  email: string
  username: string
  roles: string[]
}

const UserAccount: React.FC = () => {
  const { username, email, roles } = useAuth() as User
  const [newEmail, setNewEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false) // State for email validity
  const [otp, setOtp] = useState('')
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false) // Added missing useState

  const showMessageDialog = (msg: string) => {
    setMessage(msg)
    setIsMessageDialogOpen(true)
  }

  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setNewEmail(email)

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(email))
  }

  const logout = useLogout()
  const handleAutomaticLogout = () => {
    logout()
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
  }

  const handleUpdateEmail = async () => {
    try {
      console.log('Updating email to:', newEmail)
      const response = await fetch('/api/v1/users/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          currentEmail: email,
          newEmail: newEmail
        })
      })

      const data = await response.json()
      if (response.ok) {
        console.log(data.message)
        setOtpSent(true)
        showMessageDialog(
          'OTP is sent successfully to your current email address.'
        )
        setIsOtpModalOpen(true) // Open OTP modal
      } else if (response.status === 409) {
        showMessageDialog('Email address already exists')
      } else if (response.status === 400) {
        showMessageDialog(data.message)
      } else {
        showMessageDialog('Error sending an OTP to your current email address')
      }
    } catch (error) {
      showMessageDialog('Error sending an OTP to your current email address')
    }
  }

  const handleVerifyOtp = async () => {
    console.log('Verifying OTP:', otp)

    try {
      const response = await fetch('/api/v1/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          currentEmail: email,
          newEmail: newEmail,
          otp: otp
        })
      })

      const data = await response.json()
      if (response.ok) {
        console.log(data.message) // "Email address updated successfully"
        showMessageDialog(
          'New Email address updated successfully. Please login with your new email address.'
        )
        setTimeout(handleAutomaticLogout, 3000)
        setIsOtpModalOpen(false) // Close OTP modal after successful verification
      } else {
        showMessageDialog('Error verifying OTP')
      }
    } catch (error) {
      showMessageDialog('Error verifying OTP')
    }
  }

  const handleResendOtp = async () => {
    setOtp('')
    try {
      const response = await fetch('/api/v1/users/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          currentEmail: email,
          newEmail: newEmail
        })
      })

      const data = await response.json()
      if (response.ok) {
        showMessageDialog('OTP sent successfully to your current email address')
      } else {
        showMessageDialog('Error resending OTP')
      }
    } catch (error) {
      showMessageDialog('Error resending OTP')
    }

    console.log('Resending OTP to:', newEmail)
  }

  const handleDeleteAccount = () => {
    setIsDeleteConfirmVisible(true) // Toggle state to show delete confirmation
  }

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccountApiCall(username) // Ensure we await the async function
      setIsDeleteConfirmVisible(false) // Hide confirmation after successful deletion
    } catch (error) {
      console.error('Failed to delete account:', error)
      setIsDeleteConfirmVisible(false) // Hide confirmation even if there's an error
    }
  }

  const deleteAccountApiCall = async (username: string): Promise<void> => {
    try {
      console.log('Deleting account:', username)
      const response = await fetch(
        `/api/v1/users/delete-user-by-username/${username}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
          // No need for body since the username is in the URL
        }
      )

      const data = await response.json()

      if (response.ok) {
        showMessageDialog('Account deleted successfully')
        setTimeout(handleAutomaticLogout, 3000)
      } else if (response.status === 404) {
        showMessageDialog(data.message)
        return Promise.reject('User not found')
      } else if (response.status === 409) {
        showMessageDialog(
          'You have active jobs; please delete them first before deleting the account.'
        )
      } else {
        showMessageDialog('Error deleting account')
        return Promise.reject('Failed to delete account')
      }
    } catch (error) {
      console.error('Error during delete account API call:', error)
      showMessageDialog('An unexpected error occurred')
      return Promise.reject(error)
    }
  }
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
                disabled={!isEmailValid} // Disable button if email is invalid
              >
                Update Email
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* OTP Verification Modal */}
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
            <Button
              onClick={handleVerifyOtp}
              variant='contained'
              color='primary'
            >
              Verify OTP
            </Button>
          </DialogActions>
        </Dialog>

        {/* Message Dialog */}
        <Dialog
          open={isMessageDialogOpen}
          onClose={() => setIsMessageDialogOpen(false)}
        >
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>
            <Typography>{message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsMessageDialogOpen(false)}
              variant='contained'
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Account Deletion Section */}
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
                  '&:hover': { bgcolor: 'grey.800' }
                }}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Delete Account Confirmation Modal */}
        <Dialog
          open={isDeleteConfirmVisible}
          onClose={() => setIsDeleteConfirmVisible(false)}
        >
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteConfirmVisible(false)}
              variant='outlined'
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteAccount}
              variant='contained'
              color='error'
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default UserAccount
