import { ReactNode, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { format, parseISO } from 'date-fns'
import {
  useGetJobsQuery,
  useDeleteJobMutation,
  selectAllJobs
} from 'slices/jobsApiSlice'
import { useSelector } from 'react-redux'
import useTitle from 'hooks/useTitle'
import { clsx } from 'clsx'
import { Box } from '@mui/system'
import useAuth from 'hooks/useAuth'
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Typography,
  LinearProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import JobDetails from './JobDetails'
import BullMQSummary from '../bullmq/BullMQSummary'
import NerscStatus from '../nersc/NerscStatus'
import HeaderBox from 'components/HeaderBox'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import {
  INerscInfo,
  IJob,
  jobTypeDisplayNames
} from '@bl1231/bilbomd-mongodb-schema/frontend'
import Item from 'themes/components/Item'
import { useNavigate } from 'react-router'
import { JobActionsMenu } from './JobActionsMenu'

const getRunTimeInHours = (nersc: INerscInfo | undefined) => {
  if (!nersc?.time_started || !nersc?.time_completed) return ''
  const start = new Date(nersc.time_started)
  const end = new Date(nersc.time_completed)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''

  const diffMs = end.getTime() - start.getTime()
  const totalMinutes = Math.round(diffMs / 60000)
  const hrs = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return hrs > 0 ? `${hrs}hr${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`
}

const getHoursInQueue = (nersc: INerscInfo | undefined) => {
  if (!nersc?.time_submitted) return ''
  const start = new Date(nersc.time_submitted)
  const end = nersc.time_started ? new Date(nersc.time_started) : new Date()

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''

  const diffMs = end.getTime() - start.getTime()
  const totalMinutes = Math.round(diffMs / 60000)
  const hrs = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return hrs > 0 ? `${hrs}hr${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`
}

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

const jobTypeToRoute: Record<string, string> = {
  BilboMdPDB: 'classic',
  BilboMdCRD: 'classic',
  BilboMdAuto: 'auto',
  BilboMdScoper: 'scoper',
  BilboMdAlphaFold: 'alphafold',
  BilboMdSANS: 'sans'
}

const Jobs = () => {
  useTitle('BilboMD: Jobs List')

  const { username, isManager, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const typeFilter = searchParams.get('type') || 'All'
  const statusFilter = searchParams.get('status') || 'All'
  const userFilter = searchParams.get('user') || 'All'
  const pageParam = parseInt(searchParams.get('page') || '0', 10)
  const [page, setPage] = useState(pageParam)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuJobId, setMenuJobId] = useState<string | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetJobId, setDeleteTargetJobId] = useState<string | null>(
    null
  )
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string | null>(
    null
  )
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation()

  const openDeleteDialog = (id: string, title: string) => {
    setDeleteTargetJobId(id)
    setDeleteTargetTitle(title)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTargetJobId) {
      await deleteJob({ id: deleteTargetJobId })
      setDeleteDialogOpen(false)
      setDeleteTargetJobId(null)
      setDeleteTargetTitle(null)
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

  const {
    data: jobs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetJobsQuery('jobsList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  console.log('jobs data --->', jobs)

  const allJobs = useSelector(selectAllJobs)

  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData')

  if (configIsLoading) return <div>Loading config data...jobs</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  const useNersc = config.useNersc?.toLowerCase() === 'true'

  // jobTypes will be defined later, after jobs is confirmed available

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    searchParams.set('type', event.target.value)
    setSearchParams(searchParams)
  }

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    searchParams.set('status', event.target.value)
    setSearchParams(searchParams)
  }

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    searchParams.set('user', event.target.value)
    setSearchParams(searchParams)
  }

  const resetFilters = () => {
    searchParams.delete('type')
    searchParams.delete('status')
    searchParams.delete('user')
    setSearchParams(searchParams)
  }

  const handleResubmit = (id: string, jobType: string) => {
    const routeSegment = jobTypeToRoute[jobType]
    if (!routeSegment) return
    navigate(`/dashboard/jobs/${routeSegment}/resubmit/${id}`)
  }

  let jobTypes: string[] = []
  let availableStatuses: string[] = []
  let availableUsers: string[] = []
  let jobTypeFilterDropdown: ReactNode = null
  let statusFilterDropdown: ReactNode = null
  let userFilterDropdown: ReactNode = null

  let content: ReactNode

  if (isLoading) content = <CircularProgress />

  if ((isSuccess && jobs) || (isError && allJobs.length > 0)) {
    const showStaleWarning = isError && allJobs.length > 0
    console.log('showStaleWarning', showStaleWarning)

    const availableJobTypes = Array.from(
      new Set(allJobs.map((job) => job.mongo?.__t).filter(Boolean))
    ) as IJob['__t'][]

    jobTypes = ['All', ...availableJobTypes]

    availableStatuses = Array.from(
      new Set(allJobs.map((job) => job.mongo?.status).filter(Boolean))
    )

    availableUsers = Array.from(
      new Set(allJobs.map((job) => job.username).filter(Boolean))
    )

    jobTypeFilterDropdown = (
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
            <MenuItem key={type} value={type}>
              {type === 'All'
                ? 'All'
                : (jobTypeDisplayNames[type as IJob['__t']] ?? type)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )

    statusFilterDropdown = (
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

    userFilterDropdown = (isAdmin || isManager) && (
      <FormControl sx={{ m: 2, minWidth: 200 }} size='small'>
        <InputLabel id='user-select-label'>User</InputLabel>
        <Select
          labelId='user-select-label'
          id='user-select'
          value={userFilter}
          label='User'
          onChange={handleUserChange}
        >
          {['All', ...availableUsers].map((user) => (
            <MenuItem key={user} value={user}>
              {user}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )

    let filteredJobs = allJobs

    if (!(isManager || isAdmin)) {
      filteredJobs = filteredJobs.filter((job) => job.username === username)
    }

    if (typeFilter !== 'All') {
      filteredJobs = filteredJobs.filter((job) => job.mongo?.__t === typeFilter)
    }

    if (statusFilter !== 'All') {
      filteredJobs = filteredJobs.filter(
        (job) => job.mongo?.status === statusFilter
      )
    }

    if ((isAdmin || isManager) && userFilter !== 'All') {
      filteredJobs = filteredJobs.filter((job) => job.username === userFilter)
    }

    const rows = filteredJobs.map((job) => {
      const nerscJobid = job.mongo.nersc?.jobid || ''
      const nerscStatus = job.mongo.nersc?.state || ''
      const queueHours = getHoursInQueue(job.mongo.nersc)
      const runTimeHours = getRunTimeInHours(job.mongo.nersc)

      return {
        ...job.mongo,
        position: job.bullmq?.queuePosition ?? '',
        username: job.username,
        nerscJobid: nerscJobid,
        nerscStatus: nerscStatus,
        queueHours: queueHours,
        runTimeHours: runTimeHours,
        progress: job.mongo.progress
      }
    })

    const columns: GridColDef[] = [
      { field: 'title', headerName: 'Title', flex: 0.4, minWidth: 180 },
      {
        field: 'time_submitted',
        headerName: 'Submitted',
        type: 'dateTime',
        width: 150,
        valueFormatter: (value) => {
          if (value) {
            return format(parseISO(value), 'MM/dd/yyyy HH:mm:ss')
          } else {
            return ''
          }
        }
      },
      {
        field: 'time_completed',
        headerName: 'Completed',
        type: 'dateTime',
        width: 150,
        valueFormatter: (value) => {
          if (value) {
            return format(parseISO(value), 'MM/dd/yyyy HH:mm:ss')
          } else {
            return ''
          }
        }
      },
      ...(useNersc
        ? [
            {
              field: 'queueHours',
              headerName: 'Queue Time',
              width: 100
            },
            {
              field: 'runTimeHours',
              headerName: 'Run Time',
              width: 100
            }
          ]
        : []),
      ...(isAdmin
        ? [{ field: 'username', headerName: 'User', width: 100 }]
        : []),
      {
        field: 'status',
        headerName: 'Status',
        width: 110,
        cellClassName: (params) => {
          if (params.value == null) return ''
          return clsx('bilbomd', {
            submitted: params.value === 'Submitted',
            running: params.value === 'Running',
            error: params.value === 'Error',
            completed: params.value === 'Completed',
            pending: params.value === 'Pending',
            failed: params.value === 'Failed',
            cancelled: params.value === 'Cancelled',
            unknown: params.value === 'Unknown'
          })
        }
      },
      {
        field: 'progress',
        headerName: 'Progress',
        width: 130,
        renderCell: (params) => {
          if (params.value === undefined || params.value === null) {
            return null
          }
          const progressValue = Number(params.value)
          const displayProgress = Number.isNaN(progressValue)
            ? 0
            : progressValue
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%'
              }}
            >
              <LinearProgress
                variant='determinate'
                value={displayProgress}
                sx={{ width: '100%', marginRight: 1 }}
              />
              <Typography variant='body2' sx={{ minWidth: 35 }}>
                {`${displayProgress}%`}
              </Typography>
            </Box>
          )
        }
      },
      ...(useNersc
        ? [
            {
              field: 'nerscJobid',
              headerName: 'NERSC JobID',
              width: 110
            },
            {
              field: 'nerscStatus',
              headerName: 'NERSC Status',
              width: 110
            }
          ]
        : [
            {
              field: 'position',
              headerName: 'Position',
              width: 80
            }
          ]),
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
            <JobDetails key={`${id}-details`} id={id} />,
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
            <JobActionsMenu
              key={`${id}-menu`}
              jobId={id}
              jobType={params.row.__t}
              jobTitle={params.row.title}
              jobStatus={params.row.status}
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleMenuClose}
              onResubmit={handleResubmit}
              onDelete={openDeleteDialog}
            />
          ]
        }
      }
    ]

    content = (
      <Grid container spacing={2}>
        {!useNersc && (
          <Grid size={{ xs: 12 }}>
            <BullMQSummary />
          </Grid>
        )}

        {useNersc && (
          <Grid size={{ xs: 12 }}>
            <NerscStatus />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>Jobs</Typography>
          </HeaderBox>

          <Item>
            {showStaleWarning && (
              <Alert severity='error' variant='outlined' sx={{ mb: 2 }}>
                <AlertTitle>Backend unavailable</AlertTitle>
                Job data may be stale.
              </Alert>
            )}
            {jobTypeFilterDropdown}
            {statusFilterDropdown}
            {userFilterDropdown}
            <Button
              variant='contained'
              color='primary'
              onClick={resetFilters}
              sx={{ m: 2, height: '36px' }}
            >
              Reset Filters
            </Button>
            {filteredJobCountChip(rows.length)}

            {rows.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  maxWidth: 'calc(100vw - 260px)',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    overflow: 'auto'
                  }}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={35}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 20, page } },
                      columns: {
                        columnVisibilityModel: {
                          time_completed: false
                        }
                      }
                    }}
                    pageSizeOptions={[5, 10, 20, 40]}
                    onPaginationModelChange={(model) => {
                      setPage(model.page)
                      searchParams.set('page', model.page.toString())
                      setSearchParams(searchParams)
                    }}
                    sx={{
                      width: '100%',
                      minWidth: 0
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
              </Box>
            ) : (
              <Alert severity='info' variant='outlined' sx={{ mt: 2 }}>
                <AlertTitle>No Jobs found.</AlertTitle>Try adjusting the filters
                or running some jobs.
              </Alert>
            )}
          </Item>
        </Grid>
      </Grid>
    )
  } else if (isError) {
    let errorMessage: string = ''
    let severity: 'error' | 'warning' | 'info' = 'info'

    if (error && 'status' in error) {
      if (error.status === 204) {
        errorMessage = 'No jobs found. Please run some jobs first.'
        severity = 'info'
      } else if (error.status === 404) {
        errorMessage = 'User not found. Please contact support.'
        severity = 'error'
      } else {
        if ('error' in error && error.error) {
          errorMessage = error.error
        } else if ('data' in error && error.data) {
          errorMessage = JSON.stringify(error.data)
        } else {
          errorMessage = 'An unknown error occurred while fetching jobs.'
        }
      }
    } else {
      errorMessage = 'Backend server may be down. Please call Scott'
      severity = 'error'
    }

    content = (
      <Box>
        <Alert severity={severity} variant='outlined'>
          <AlertTitle>{errorMessage}</AlertTitle>
        </Alert>
      </Box>
    )
  }

  return content
}

export default Jobs
