import React, { useState } from 'react'
import {
  useGetAPITokensQuery,
  useCreateAPITokenMutation,
  useDeleteAPITokenMutation
} from '../../slices/usersApiSlice'
import {
  Button,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { IAPIToken } from '@bl1231/bilbomd-mongodb-schema'
import useAuth from 'hooks/useAuth'

const APITokenManager = () => {
  const { username } = useAuth()
  const { data, refetch, isLoading, error } = useGetAPITokensQuery(username)
  const tokens: IAPIToken[] = data?.tokens || []
  const [createToken] = useCreateAPITokenMutation()
  const [deleteToken] = useDeleteAPITokenMutation()
  const [label, setLabel] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [newToken, setNewToken] = useState<string | null>(null)

  const handleCreateToken = async () => {
    try {
      const res = await createToken({ username, label, expiresAt }).unwrap()
      setNewToken(res.token)
      setLabel('')
      setExpiresAt('')
      refetch()
    } catch (err) {
      console.error('Failed to create token:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteToken({ username, id }).unwrap()
      refetch()
    } catch (err) {
      console.error('Failed to delete token:', err)
    }
  }

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        API Tokens
      </Typography>

      {newToken && (
        <Box mb={2} p={2} bgcolor='#f5f5f5' borderRadius={1}>
          <Typography variant='body2' color='primary'>
            This is your new token. Copy it now — you won’t be able to see it
            again:
          </Typography>
          <Typography variant='body1' sx={{ wordBreak: 'break-all' }}>
            {newToken}
          </Typography>
        </Box>
      )}

      <Box display='flex' gap={2} mb={2}>
        <TextField
          label='Label'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          size='small'
        />
        <TextField
          label='Expires At (optional)'
          type='datetime-local'
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          size='small'
          InputLabelProps={{ shrink: true }}
        />
        <Button variant='contained' onClick={handleCreateToken}>
          Create Token
        </Button>
      </Box>

      {isLoading && <Typography>Loading tokens...</Typography>}
      {error && <Typography color='error'>Error loading tokens</Typography>}

      <List>
        {tokens.map((token) => (
          <React.Fragment key={token._id?.toString()}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge='end'
                  onClick={() => handleDelete(token._id!.toString())}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={token.label || 'Unnamed Token'}
                secondary={`Created: ${new Date(token.createdAt).toLocaleString()} | Expires: ${token.expiresAt ? new Date(token.expiresAt).toLocaleString() : 'Never'}`}
              />
            </ListItem>
            <Divider component='li' />
          </React.Fragment>
        ))}
      </List>
    </Box>
  )
}

export default APITokenManager
