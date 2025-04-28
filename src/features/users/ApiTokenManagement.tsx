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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Snackbar,
  Alert
} from '@mui/material'
import { purple, grey, blueGrey } from '@mui/material/colors'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CloseIcon from '@mui/icons-material/Close'
import { IAPIToken } from '@bl1231/bilbomd-mongodb-schema'
import useAuth from 'hooks/useAuth'

const APITokenManager = () => {
  const { username } = useAuth()
  const { data, refetch, isLoading, error } = useGetAPITokensQuery(username)
  const tokens: IAPIToken[] = data?.tokens || []
  const [createToken] = useCreateAPITokenMutation()
  const [deleteToken] = useDeleteAPITokenMutation()
  const [newToken, setNewToken] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const tokenLimit = 3

  const handleCreateToken = async (label: string, daysValid: number) => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysValid)

    try {
      const res = await createToken({
        username,
        label,
        expiresAt: expiresAt.toISOString()
      }).unwrap()
      setNewToken(res.token)
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
    <Box
      sx={{
        p: 0,
        border: 1,
        borderRadius: 1,
        borderColor: grey[500],
        backgroundColor: grey[300],
        width: '100%',
        maxWidth: '960px',
        mx: 'auto'
      }}
    >
      <Box
        sx={{
          backgroundColor: grey[400],
          p: 1,
          m: 0,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottom: 1,
          borderColor: grey[500]
        }}
      >
        <Typography variant='h4'>Create API Tokens</Typography>
      </Box>

      {newToken && (
        <Box
          sx={{
            m: 2,
            mx: 2,
            p: 2,
            bgcolor: blueGrey[100],
            borderRadius: 1,
            border: 1,
            borderColor: purple[100],
            position: 'relative'
          }}
        >
          <IconButton
            size='small'
            onClick={() => {
              setNewToken(null)
              setCopySuccess(false)
            }}
            sx={{ position: 'absolute', top: 4, right: 4 }}
            aria-label='Dismiss'
          >
            <CloseIcon fontSize='small' />
          </IconButton>

          <Typography variant='body2' gutterBottom>
            This is your new API token. Copy it now — you won’t be able to see
            it again:
          </Typography>
          <Chip
            label={newToken}
            onClick={() => {
              navigator.clipboard.writeText(newToken)
              setCopySuccess(true)
            }}
            deleteIcon={<ContentCopyIcon />}
            onDelete={() => {
              navigator.clipboard.writeText(newToken)
              setCopySuccess(true)
            }}
            sx={{
              bgcolor: purple[100],
              color: purple[900],
              fontWeight: 'bold',
              maxWidth: '100%',
              overflowWrap: 'anywhere',
              paddingRight: 1
            }}
            variant='outlined'
          />
        </Box>
      )}

      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Choose a token &quot;flavor&quot; based on what you need:
          <br />
          <strong>Green:</strong> Read-only (get job status), valid 30 days.
          <br />
          <strong>Yellow:</strong> Status + download results, valid 14 days.
          <br />
          <strong>Red:</strong> Full access (create + read jobs), valid 7 days.
        </Typography>
      </Box>

      {tokens.length >= tokenLimit ? (
        <Alert severity='warning' sx={{ mx: 2, mb: 3 }}>
          You have reached the maximum of 3 active API tokens. Please delete one
          before creating another.
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            px: 2,
            pb: 2,
            borderBottom: 1,
            borderColor: grey[500]
          }}
        >
          <Button
            variant='contained'
            color='success'
            onClick={() => handleCreateToken('green', 30)}
          >
            Create Green Token
          </Button>
          <Button
            variant='contained'
            color='warning'
            onClick={() => handleCreateToken('yellow', 14)}
          >
            Create Yellow Token
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => handleCreateToken('red', 7)}
          >
            Create Red Token
          </Button>
        </Box>
      )}

      {newToken && (
        <Snackbar
          open={copySuccess}
          autoHideDuration={2000}
          onClose={() => setCopySuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setCopySuccess(false)}
            severity='success'
            sx={{ width: '100%' }}
          >
            Token copied to clipboard!
          </Alert>
        </Snackbar>
      )}

      {isLoading && <Typography>Loading tokens...</Typography>}
      {error && <Typography color='error'>Error loading tokens</Typography>}

      <Box
        sx={{
          backgroundColor: grey[400],
          p: 1,
          borderBottom: 1,
          borderTop: 1,
          borderColor: grey[500]
        }}
      >
        <Typography variant='h4'>Existing API Tokens</Typography>
      </Box>

      <Box sx={{ p: 0, m: 0 }}>
        {tokens.length === 0 ? (
          <Alert severity='info' sx={{ m: 2 }}>
            You have no API tokens. Create one using the buttons above.
          </Alert>
        ) : (
          <List sx={{ p: 1, m: 0 }}>
            {tokens.map((token, index) => (
              <Box
                key={token._id?.toString()}
                sx={{
                  borderBottom: index < tokens.length - 1 ? 1 : 0,
                  borderColor: grey[500]
                }}
              >
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
                    primary={
                      <Chip
                        label={token.label}
                        color={
                          token.label === 'green'
                            ? 'success'
                            : token.label === 'yellow'
                              ? 'warning'
                              : 'error'
                        }
                        size='small'
                        sx={{ fontWeight: 'bold', width: '80px' }}
                      />
                    }
                    secondary={
                      <Box>
                        Created: {new Date(token.createdAt).toLocaleString()}
                        <br />
                        {token.expiresAt
                          ? `Expires in ${Math.ceil(
                              (new Date(token.expiresAt).getTime() -
                                Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )} day(s)`
                          : 'No expiration'}
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}

export default APITokenManager
