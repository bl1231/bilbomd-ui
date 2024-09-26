import * as React from 'react'
import { useReducer } from 'react'
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
import {
  useUpdateEmailMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useDeleteUserByUserNameMutation
} from '../../slices/userAccountApiSlice'

interface User {
  email: string
  username: string
  roles: string[]
}

interface State {
  newEmail: string
  isEmailValid: boolean
  otp: string
  isOtpModalOpen: boolean
  isMessageDialogOpen: boolean
  message: string
  isDeleteConfirmVisible: boolean
}

const initialState: State = {
  newEmail: '',
  isEmailValid: false,
  otp: '',
  isOtpModalOpen: false,
  isMessageDialogOpen: false,
  message: '',
  isDeleteConfirmVisible: false
}

type Action =
  | { type: 'SET_NEW_EMAIL'; payload: string }
  | { type: 'SET_IS_EMAIL_VALID'; payload: boolean }
  | { type: 'SET_OTP'; payload: string }
  | { type: 'TOGGLE_OTP_MODAL'; payload: boolean }
  | { type: 'TOGGLE_MESSAGE_DIALOG'; payload: boolean }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'TOGGLE_DELETE_CONFIRM'; payload: boolean }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_NEW_EMAIL':
      return { ...state, newEmail: action.payload }
    case 'SET_IS_EMAIL_VALID':
      return { ...state, isEmailValid: action.payload }
    case 'SET_OTP':
      return { ...state, otp: action.payload }
    case 'TOGGLE_OTP_MODAL':
      return { ...state, isOtpModalOpen: action.payload }
    case 'TOGGLE_MESSAGE_DIALOG':
      return { ...state, isMessageDialogOpen: action.payload }
    case 'SET_MESSAGE':
      return { ...state, message: action.payload }
    case 'TOGGLE_DELETE_CONFIRM':
      return { ...state, isDeleteConfirmVisible: action.payload }
    default:
      return state
  }
}

const UserAccount: React.FC = () => {
  const { username, email, roles } = useAuth() as User
  const [state, dispatch] = useReducer(reducer, initialState)

  const [updateEmail] = useUpdateEmailMutation()
  const [verifyOtp] = useVerifyOtpMutation()
  const [resendOtp] = useResendOtpMutation()
  const [deleteUserByUserName] = useDeleteUserByUserNameMutation()

  const showMessageDialog = (msg: string) => {
    dispatch({ type: 'SET_MESSAGE', payload: msg })
    dispatch({ type: 'TOGGLE_MESSAGE_DIALOG', payload: true })
  }

  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    dispatch({ type: 'SET_NEW_EMAIL', payload: email })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    dispatch({ type: 'SET_IS_EMAIL_VALID', payload: emailRegex.test(email) })
  }

  const logout = useLogout()
  const handleAutomaticLogout = () => {
    logout()
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_OTP', payload: e.target.value })
  }

  const handleUpdateEmail = async () => {
    try {
      console.log('Updating email to:', state.newEmail)
      await updateEmail({
        username,
        currentEmail: email,
        newEmail: state.newEmail
      }).unwrap()

      showMessageDialog(
        'OTP is sent successfully to your current email address.'
      )
      dispatch({ type: 'TOGGLE_OTP_MODAL', payload: true }) // Open OTP modal
    } catch (error: any) {
      if (error.status === 409) {
        showMessageDialog('Email address already exists')
      } else if (error.status === 400) {
        showMessageDialog(error.data.message)
      } else {
        showMessageDialog('Error sending an OTP to your current email address')
      }
    }
  }

  const handleVerifyOtp = async () => {
    console.log('Verifying OTP:', state.otp)

    try {
      await verifyOtp({
        username,
        currentEmail: email,
        newEmail: state.newEmail,
        otp: state.otp
      }).unwrap()

      showMessageDialog(
        'New Email address updated successfully. Please login with your new email address.'
      )
      setTimeout(handleAutomaticLogout, 3000)
      dispatch({ type: 'TOGGLE_OTP_MODAL', payload: false }) // Close OTP modal after successful verification
    } catch (error) {
      showMessageDialog('Error verifying OTP')
    }
  }

  const handleResendOtp = async () => {
    dispatch({ type: 'SET_OTP', payload: '' })
    try {
      await resendOtp({
        username,
        currentEmail: email,
        newEmail: state.newEmail
      }).unwrap()

      showMessageDialog('OTP sent successfully to your current email address')
    } catch (error) {
      showMessageDialog('Error resending OTP')
    }
  }

  const handleDeleteAccount = () => {
    dispatch({ type: 'TOGGLE_DELETE_CONFIRM', payload: true }) // Toggle state to show delete confirmation
  }

  const confirmDeleteAccount = async () => {
    if (!username) {
      showMessageDialog('Username is undefined. Cannot delete account.')
      return
    }

    try {
      console.log('Deleting account:', username)
      await deleteUserByUserName(username).unwrap()
      showMessageDialog('Account deleted successfully')
      setTimeout(handleAutomaticLogout, 3000)
      dispatch({ type: 'TOGGLE_DELETE_CONFIRM', payload: false }) // Hide confirmation after successful deletion
    } catch (error: any) {
      if (error.status === 404) {
        showMessageDialog(error.data.message)
      } else if (error.status === 409) {
        showMessageDialog(
          'You have active jobs; please delete them first before deleting the account.'
        )
      } else {
        showMessageDialog('Error deleting account')
      }
      dispatch({ type: 'TOGGLE_DELETE_CONFIRM', payload: false }) // Hide confirmation even if there's an error
    }
  }

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
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
      {title}
    </Typography>
  )

  const CustomDialog: React.FC<{
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    actions: React.ReactNode
  }> = ({ open, onClose, title, children, actions }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  )

  return (
    <>
      <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 4 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <SectionHeader title='User Information' />
            <Box sx={{ p: 2 }}>
              <Typography>User Name: {username}</Typography>
              <Typography>Email Address: {email}</Typography>
              <Typography>Roles: {roles.join(', ')}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <SectionHeader title='Change Email Address' />
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                label='New Email Address'
                variant='outlined'
                value={state.newEmail}
                onChange={handleNewEmailChange}
                sx={{ mb: 2 }}
                placeholder='Enter new email address'
              />
              <Button
                fullWidth
                variant='contained'
                color='primary'
                onClick={handleUpdateEmail}
                disabled={!state.isEmailValid} // Disable button if email is invalid
              >
                Update Email
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* OTP Verification Modal */}
        <CustomDialog
          open={state.isOtpModalOpen}
          onClose={() => dispatch({ type: 'TOGGLE_OTP_MODAL', payload: false })}
          title='Verify OTP'
          actions={
            <>
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
            </>
          }
        >
          <TextField
            fullWidth
            label='Enter OTP'
            variant='outlined'
            value={state.otp}
            onChange={handleOtpChange}
            sx={{ mt: 2 }}
            placeholder='Enter OTP'
          />
        </CustomDialog>

        {/* Message Dialog */}
        <CustomDialog
          open={state.isMessageDialogOpen}
          onClose={() =>
            dispatch({ type: 'TOGGLE_MESSAGE_DIALOG', payload: false })
          }
          title='Notification'
          actions={
            <Button
              onClick={() =>
                dispatch({ type: 'TOGGLE_MESSAGE_DIALOG', payload: false })
              }
              variant='contained'
            >
              OK
            </Button>
          }
        >
          <Typography>{state.message}</Typography>
        </CustomDialog>

        {/* Account Deletion Section */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <SectionHeader title='Delete Account' />
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
        <CustomDialog
          open={state.isDeleteConfirmVisible}
          onClose={() =>
            dispatch({ type: 'TOGGLE_DELETE_CONFIRM', payload: false })
          }
          title='Confirm Account Deletion'
          actions={
            <>
              <Button
                onClick={() =>
                  dispatch({ type: 'TOGGLE_DELETE_CONFIRM', payload: false })
                }
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
            </>
          }
        >
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
        </CustomDialog>
      </Box>
    </>
  )
}

export default UserAccount
