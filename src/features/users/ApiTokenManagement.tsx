import { useState } from 'react'
import {
  useGetAPITokensQuery,
  useCreateAPITokenMutation,
  useDeleteAPITokenMutation
} from '../../slices/usersApiSlice'
import {
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  Chip,
  Alert
} from '@mui/material'
import { purple, grey, blueGrey, green } from '@mui/material/colors'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CloseIcon from '@mui/icons-material/Close'
import { IAPIToken } from '@bl1231/bilbomd-mongodb-schema'
import useAuth from 'hooks/useAuth'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format, formatDistanceToNowStrict } from 'date-fns'
import { parseDateSafe } from 'utils/dates'
import { useSnackbar } from 'notistack'

const APITokenManager = () => {
  const { username } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const { data, refetch, isLoading, error } = useGetAPITokensQuery(username)
  const tokens: IAPIToken[] = data?.tokens || []
  const [createToken] = useCreateAPITokenMutation()
  const [deleteToken] = useDeleteAPITokenMutation()
  const [newToken, setNewToken] = useState<string | null>(null)
  const tokenLimit = 3

  const rows = tokens.map((token) => ({
    id: token._id?.toString() || '',
    label: token.label,
    createdAt: token.createdAt,
    expiresAt: token.expiresAt,
    expiresIn: token.expiresAt
  }))

  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: 'Label',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.label}
          color={
            params.row.label === 'green'
              ? 'success'
              : params.row.label === 'yellow'
                ? 'warning'
                : 'error'
          }
          size='small'
          sx={{ fontWeight: 'bold', width: '80px' }}
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      type: 'dateTime',
      width: 180,
      valueFormatter: (value) => {
        if (value) {
          return (() => {
            const d = parseDateSafe(value)
            return d ? format(d, 'MM/dd/yyyy HH:mm:ss') : ''
          })()
        } else {
          return ''
        }
      }
    },
    {
      field: 'expiresAt',
      headerName: 'Expires',
      type: 'dateTime',
      width: 180,
      valueFormatter: (value) => {
        if (value) {
          return (() => {
            const d = parseDateSafe(value)
            return d ? format(d, 'MM/dd/yyyy HH:mm:ss') : ''
          })()
        } else {
          return 'No expiration'
        }
      }
    },
    {
      field: 'expiresIn',
      headerName: 'Expires In',
      width: 180,
      valueFormatter: (value) => {
        if (value) {
          const expiresAt = parseDateSafe(value)
          if (!expiresAt) {
            return ''
          }
          if (expiresAt.getTime() < Date.now()) {
            return 'Expired'
          }
          return `in ${formatDistanceToNowStrict(expiresAt)}`
        } else {
          return 'Never'
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          edge='end'
          onClick={() => handleDelete(params.id.toString())}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ]

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
      enqueueSnackbar(`${label} Token created.`, { variant: 'default' })
      refetch()
    } catch (err) {
      console.error('Failed to create token:', err)
      enqueueSnackbar('Failed to create token.', { variant: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteToken({ username, id }).unwrap()
      enqueueSnackbar('Token deleted.', { variant: 'default' })
      refetch()
    } catch (err) {
      console.error('Failed to delete token:', err)
      enqueueSnackbar('Failed to delete token.', { variant: 'error' })
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
      <Box
        sx={{
          m: 2
        }}
      >
        <Typography variant='body2'>
          Need help? Check out our{' '}
          <Link
            href='/api-docs'
            target='_blank'
            rel='noopener noreferrer'
            underline='hover'
          >
            API Documentation
          </Link>
          .
        </Typography>
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
            icon={<ContentCopyIcon />}
            onClick={() => {
              navigator.clipboard.writeText(newToken)
              enqueueSnackbar('Token copied to clipboard!', {
                variant: 'default'
              })
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
      <Box sx={{ px: 2 }}>
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

      <Box
        sx={{
          height: '100%',
          width: '100%',
          p: 2
        }}
      >
        {isLoading ? (
          <Typography>Loading tokens...</Typography>
        ) : error ? (
          <Typography color='error'>Error loading tokens</Typography>
        ) : tokens.length === 0 ? (
          <Alert severity='info'>No API tokens yet. Create one above.</Alert>
        ) : (
          <Box sx={{ backgroundColor: grey[200], borderRadius: 1 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              hideFooter
              disableColumnFilter
              disableColumnSelector
              disableColumnMenu
              disableColumnSorting
              sx={{
                '--DataGrid-containerBackground': green[100],
                '.MuiDataGrid-columnHeaders': {
                  backgroundColor: green[100]
                },
                '.MuiDataGrid-columnSeparator': {
                  color: green[700]
                }
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default APITokenManager
