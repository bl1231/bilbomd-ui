import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { grey } from '@mui/material/colors'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import {
  useGetQueuesQuery,
  useGetJobsByQueueQuery,
  useDeleteQueueJobMutation,
  useRetryQueueJobMutation
} from '../../slices/adminApiSlice'
import { FrontendBullMQJob } from '../../types/bullmq'
import { QueueJobActionsMenu } from './QueueJobActionsMenu'
import BoxDataGridWrapper from '../../themes/components/BoxDataGridWrapper'

interface BilboMDJobData {
  type: string
  title: string
  uuid: string
  jobid: string
}

const QueueDetailsPage = () => {
  const { queueName } = useParams<{ queueName: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') || 'All'
  const statusFilter = searchParams.get('status') || 'All'
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuJobId, setMenuJobId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetJobId, setDeleteTargetJobId] = useState<string | null>(
    null
  )
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string | null>(
    null
  )
  const [deleteJob, { isLoading: isDeleting }] = useDeleteQueueJobMutation()
  const [retryQueueJob] = useRetryQueueJobMutation()

  const handleRetry = (jobId: string) => {
    if (!queueName) return
    retryQueueJob({ queueName, jobId })
  }

  const openDeleteDialog = (id: string) => {
    setDeleteTargetJobId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!queueName || !deleteTargetJobId) return
    try {
      await deleteJob({ queueName, jobId: deleteTargetJobId }).unwrap()
      setDeleteDialogOpen(false)
      setDeleteTargetJobId(null)
      setDeleteTargetTitle(null)
    } catch (error) {
      console.error('Failed to delete job:', error)
      // optionally show error UI
    }
  }
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget)
    setMenuJobId(id)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuJobId(null)
  }
  const { data: queues, isLoading, error } = useGetQueuesQuery({})
  const {
    data: jobs,
    isLoading: jobsLoading,
    error: jobsError
  } = useGetJobsByQueueQuery(queueName || '')

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity='error'>Failed to load queue data: {String(error)}</Alert>
    )
  }

  interface Queue {
    name: string
    isPaused: boolean
    jobCounts: Record<string, number>
  }

  const matchedQueue: Queue | undefined = queues?.find(
    (queueItem: Queue) => queueItem.name === queueName
  )

  if (!matchedQueue) {
    return <Alert severity='warning'>Queue not found.</Alert>
  }

  // console.log('Jobs:', jobs)

  const typedJobs: FrontendBullMQJob<BilboMDJobData>[] = jobs?.jobs ?? []

  const filteredJobs = typedJobs.filter((job) => {
    const matchesType = typeFilter === 'All' || job.data?.type === typeFilter
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter
    return matchesType && matchesStatus
  })

  const filteredJobCountChip = (count: number) => {
    return (
      <Chip
        label={`${count} job${count !== 1 ? 's' : ''} `}
        sx={{
          backgroundColor: '#262626',
          color: '#bae637',
          fontSize: '1.3em',
          fontWeight: 'bold',
          p: 1,
          m: 1,
          height: '36px'
        }}
      />
    )
  }

  const availableJobTypes: string[] = Array.from(
    new Set(
      typedJobs
        .map((job) => job.data?.type)
        .filter((type): type is string => Boolean(type))
    )
  )

  const jobTypes = ['All', ...availableJobTypes]

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    searchParams.set('type', event.target.value)
    setSearchParams(searchParams)
  }

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    searchParams.set('status', event.target.value)
    setSearchParams(searchParams)
  }

  const resetFilters = () => {
    searchParams.delete('type')
    searchParams.delete('status')
    searchParams.delete('user')
    setSearchParams(searchParams)
  }

  const jobTypeFilterDropdown = (
    <FormControl sx={{ m: 2, minWidth: 200 }} size='small'>
      <InputLabel id='job-type-select-label'>Job Type</InputLabel>
      <Select
        labelId='job-type-select-label'
        id='job-type-select'
        value={typeFilter}
        label='Job Type'
        onChange={handleTypeChange}
      >
        {jobTypes.map((type) => (
          <MenuItem key={String(type)} value={type}>
            {type === 'All' ? 'All' : (type ?? type)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const availableStatuses = Array.from(
    new Set(
      typedJobs
        .map((job) => job.status)
        .filter((status): status is string => Boolean(status))
    )
  )

  const statusFilterDropdown = (
    <FormControl sx={{ m: 2, minWidth: 200 }} size='small'>
      <InputLabel id='status-select-label'>Status</InputLabel>
      <Select
        labelId='status-select-label'
        id='status-select'
        value={statusFilter}
        label='Status'
        onChange={handleStatusChange}
      >
        {['All', ...availableStatuses].map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  return (
    <BoxDataGridWrapper>
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
        <Typography variant='h4'>
          Queue Details: {matchedQueue?.name}
        </Typography>
      </Box>
      <Box>
        <Box sx={{ p: 2 }}>
          {' '}
          Status:
          <Chip
            label={matchedQueue?.isPaused ? 'Paused' : 'Running'}
            sx={{
              backgroundColor: matchedQueue?.isPaused ? '#f5222d' : '#52c41a',
              color: '#fff',
              fontSize: '1em',
              fontWeight: 'bold',
              p: 1,
              m: 1,
              height: '36px'
            }}
          />
        </Box>
        <Box sx={{ px: 2 }}>
          {' '}
          <Typography variant='h6' gutterBottom>
            Job Counts:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {Object.entries(matchedQueue?.jobCounts).map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                sx={{
                  backgroundColor: '#262626',
                  color: '#bae637',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  p: 1,
                  height: '36px'
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          {' '}
          <Typography variant='h6' gutterBottom>
            Jobs in Queue:
          </Typography>
          {jobsLoading && (
            <Box display='flex' justifyContent='center' mt={2}>
              <CircularProgress size={20} />
            </Box>
          )}
          {jobsError && (
            <Alert severity='error'>
              Failed to load jobs: {String(jobsError)}
            </Alert>
          )}
          {jobTypeFilterDropdown}
          {statusFilterDropdown}
          {/* {userFilterDropdown} */}
          <Button
            variant='contained'
            color='primary'
            onClick={resetFilters}
            sx={{ m: 2, height: '36px' }}
          >
            Reset Filters
          </Button>
          {jobs && filteredJobCountChip(filteredJobs.length)}
        </Box>

        {jobs && (
          <Box sx={{ height: 500, width: '100%', mt: 2 }}>
            <DataGrid
              rows={filteredJobs.map((job) => ({
                id: job.id,
                name: job.name,
                type: job.data?.type,
                status: job.status,
                attemptsMade: job.attemptsMade,
                submitted: new Date(job.timestamp).toLocaleString(),
                uuid: job.data?.uuid
              }))}
              columns={
                [
                  { field: 'name', headerName: 'Name', flex: 0.25 },
                  { field: 'type', headerName: 'Type', width: 120 },
                  { field: 'status', headerName: 'Status', width: 120 },
                  { field: 'attemptsMade', headerName: 'Attempts', width: 100 },
                  { field: 'submitted', headerName: 'Submitted', width: 180 },
                  { field: 'uuid', headerName: 'UUID', flex: 0.25 },
                  {
                    field: 'actions',
                    type: 'actions',
                    sortable: false,
                    headerName: 'Manage',
                    width: 250,
                    getActions: (params: GridRowParams) => {
                      const id = params.row.id
                      const isOpen = Boolean(anchorEl) && menuJobId === id

                      return [
                        <Button
                          key={`${id}-menu-btn`}
                          variant='outlined'
                          disableElevation
                          size='small'
                          className='job-details-button'
                          onClick={(e) => handleMenuOpen(e, id)}
                          endIcon={<KeyboardArrowDownIcon />}
                        >
                          More Actions
                        </Button>,
                        <QueueJobActionsMenu
                          key={`${id}-menu`}
                          jobId={id}
                          jobType={params.row.type}
                          jobTitle={params.row.name}
                          jobStatus={params.row.status}
                          anchorEl={anchorEl}
                          open={isOpen}
                          onClose={handleMenuClose}
                          onRetry={handleRetry}
                          onDelete={openDeleteDialog}
                        />
                      ]
                    }
                  }
                ] as GridColDef[]
              }
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } }
              }}
            />
            {/* Delete confirmation dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
            >
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete the job{' '}
                  <strong>{deleteTargetTitle}</strong>?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  color='error'
                  disabled={isDeleting}
                  variant='contained'
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </BoxDataGridWrapper>
  )
}

export default QueueDetailsPage
