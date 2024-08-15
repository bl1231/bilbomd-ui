import * as React from 'react'
import { useState } from 'react'
import {
  Typography,
  Button,
  Box,
  TextField,
  Card,
  CardContent
} from '@mui/material'
import useAuth from 'hooks/useAuth'

interface User {
  id: string
  email: string
  username: string
  roles: string[]
}

const UserAccount: React.FC = () => {
  const { username, email, roles } = useAuth() as User
  const [newEmail, setNewEmail] = useState('')
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false)

  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value)
  }

  const handleUpdateEmail = async () => {
    console.log('Updating email to:', newEmail)
  }

  const handleDeleteAccount = () => {
    setIsDeleteConfirmVisible(true)
  }

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccountApiCall(username)
    } catch (error) {
      console.error('Failed to delete account:', error)
    }
    setIsDeleteConfirmVisible(false)
  }

  const deleteAccountApiCall = (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve()
        } else {
          reject(new Error('Failed to delete account'))
        }
      }, 1000)
    })
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 4 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {' '}
          {/* Remove padding from the CardContent */}
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
            {' '}
            {/* Add padding to content below the header */}
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
  )
}

export default UserAccount
