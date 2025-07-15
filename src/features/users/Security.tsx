import { useState } from 'react'
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Alert
} from '@mui/material'
import { grey } from '@mui/material/colors'
import useAuth from 'hooks/useAuth'
import useLogout from 'hooks/useLogout'
import { useDeleteUserByUserNameMutation } from '../../slices/userAccountApiSlice'

interface User {
  username: string
  email: string
  roles: string[]
}

interface CustomError {
  status: number
  data: {
    message: string
  }
}

const Security = () => {
  const { username, email, roles } = useAuth() as User
  const [deleteUserByUserName] = useDeleteUserByUserNameMutation()
  const logout = useLogout()

  // State management
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [message, setMessage] = useState('')
  const handleDeleteAccount = () => {
    setIsDeleteConfirmVisible(true)
  }
  const showMessageDialog = (msg: string) => {
    setMessage(msg)
    setIsMessageDialogOpen(true)
  }
  const handleAutomaticLogout = () => {
    logout()
  }
  const confirmDeleteAccount = async () => {
    if (!username) {
      showMessageDialog('Username is undefined. Cannot delete account.')
      return
    }
    try {
      await deleteUserByUserName(username).unwrap()
      showMessageDialog('Account deleted successfully')
      setTimeout(handleAutomaticLogout, 3000)
      setIsDeleteConfirmVisible(false)
    } catch (error) {
      const customError = error as CustomError
      if (customError.status === 404) {
        showMessageDialog(customError.data.message)
      } else if (customError.status === 409) {
        showMessageDialog(
          'You have active jobs; please delete them first before deleting the account.'
        )
      } else {
        showMessageDialog('Error deleting account')
      }
      setIsDeleteConfirmVisible(false)
    }
  }
  return (
    <Box
      sx={{
        p: 0,
        border: 1,
        borderRadius: 1,
        borderColor: grey[500],
        backgroundColor: grey[300],
        width: '100%',
        maxWidth: '960px'
      }}
    >
      {/* User Information Section */}
      <Box
        sx={{
          backgroundColor: grey[400],
          p: 1,
          borderBottom: 1,
          borderColor: grey[500]
        }}
      >
        <Typography variant='h4'>User Information</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, bgcolor: grey[200], p: 2, borderRadius: 1 }}>
          <Box sx={{ display: 'flex', mb: 1.5 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', minWidth: '100px' }}>
              Username:
            </Typography>
            <Typography variant='body1'>{username}</Typography>
          </Box>

          <Box sx={{ display: 'flex', mb: 1.5 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', minWidth: '100px' }}>
              Email:
            </Typography>
            <Typography variant='body1'>{email}</Typography>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', minWidth: '100px' }}>
              Roles:
            </Typography>
            <Typography variant='body1'>
              {roles?.join(', ') || 'No roles assigned'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Delete Account Section */}
      <Box
        sx={{
          backgroundColor: grey[400],
          p: 1,
          borderBottom: 1,
          borderTop: 1,
          borderColor: grey[500]
        }}
      >
        <Typography variant='h4'>Delete Account</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Alert severity='warning' sx={{ mb: 2 }}>
          Deleting your account is permanent. All your data will be removed and
          cannot be recovered.
        </Alert>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteAccount}
            sx={{ mt: 2, px: 4 }}
          >
            Delete Account
          </Button>
        </Box>
      </Box>
      {/* Delete Account Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmVisible}
        onClose={() => setIsDeleteConfirmVisible(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone. All your data will be permanently deleted.
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
    </Box>
  )
}

export default Security
