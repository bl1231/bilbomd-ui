import { useState } from 'react'
import { FormControlLabel, Switch } from '@mui/material'
import { Box, Typography, CircularProgress, Alert, Chip } from '@mui/material'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { useGetQueuesQuery } from '../../slices/adminApiSlice'
import { grey } from '@mui/material/colors'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { QueueToggleControl } from './QueueToggleControl'
import QueueDetails from './QueueDetails'

interface QueueInfo {
  name: string
  isPaused: boolean
  jobCounts: {
    active: number
    completed: number
    delayed: number
    failed: number
    paused: number
    prioritized: number
    waiting: number
    ['waiting-children']: number
  }
}

const QueueOverviewPanel = () => {
  const [pollingEnabled, setPollingEnabled] = useState(false)

  const {
    data: queues,
    isLoading,
    error,
    isFetching
  } = useGetQueuesQuery(
    {},
    {
      pollingInterval: pollingEnabled ? 5000 : 0
    }
  )

  if (isLoading) return <CircularProgress />
  if (error) return <Alert severity='error'>Failed to load queue data</Alert>

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Queue', width: 120 },
    {
      field: 'isPaused',
      headerName: 'Queue Paused?',
      flex: 0.3,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'warning' : 'success'}
          size='small'
        />
      )
    },
    { field: 'active', headerName: 'Active', type: 'number', width: 110 },
    { field: 'paused', headerName: 'Paused', type: 'number', width: 110 },
    { field: 'waiting', headerName: 'Waiting', type: 'number', width: 110 },
    { field: 'completed', headerName: 'Completed', type: 'number', width: 110 },
    { field: 'failed', headerName: 'Failed', type: 'number', width: 110 },
    { field: 'delayed', headerName: 'Delayed', type: 'number', width: 110 },
    {
      field: 'actions',
      type: 'actions',
      sortable: false,
      headerName: 'Controls',
      width: 220,
      getActions: (params: GridRowParams) => {
        return [
          <QueueToggleControl
            key={`${params.id}-toggle`}
            queueName={params.row.name}
            isPaused={params.row.isPaused}
          />,
          <QueueDetails key={`${params.id}-details`} queue={params.row.name} />
        ]
      }
    }
  ]

  const rows =
    queues?.map((queue: QueueInfo) => ({
      id: queue.name,
      name: queue.name,
      isPaused: queue.isPaused,
      active: queue.jobCounts.active,
      paused: queue.jobCounts.paused,
      waiting: queue.jobCounts.waiting,
      completed: queue.jobCounts.completed,
      failed: queue.jobCounts.failed,
      delayed: queue.jobCounts.delayed
    })) ?? []

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: grey[500],
          p: 1,
          m: 0,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottom: 1,
          borderColor: grey[500]
        }}
      >
        <Typography variant='h4'>BullMQ Dashboard</Typography>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', m: 1, px: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={pollingEnabled}
                onChange={(e) => setPollingEnabled(e.target.checked)}
              />
            }
            label='Auto-refresh (every 5s)'
          />
          {pollingEnabled && (
            <AutorenewIcon
              fontSize='small'
              sx={{
                ml: 1,
                color: isFetching ? 'primary.main' : 'text.disabled',
                '@keyframes spin': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' }
                },
                animation: isFetching ? 'spin 1s linear infinite' : 'none'
              }}
            />
          )}
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          disableColumnSorting
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } }
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </Box>
    </Box>
  )
}

export default QueueOverviewPanel
