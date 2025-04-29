import { ReactNode, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { format, parseISO } from 'date-fns'
import { useGetJobsQuery } from 'slices/jobsApiSlice'
import useTitle from 'hooks/useTitle'
import { clsx } from 'clsx'
import { Box } from '@mui/system'
import { green, red, amber, grey } from '@mui/material/colors'
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
import DeleteJob from './DeleteJob'
import JobDetails from './JobDetails'
import BullMQSummary from '../bullmq/BullMQSummary'
import NerscStatus from '../nersc/NerscStatus'
import HeaderBox from 'components/HeaderBox'
import { BilboMDJob } from 'types/interfaces'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import {
  INerscInfo,
  IJob,
  jobTypeDisplayNames
} from '@bl1231/bilbomd-mongodb-schema/frontend'
import Item from 'themes/components/Item'

const getHoursInQueue = (nersc: INerscInfo | undefined) => {
  if (!nersc?.time_submitted) return ''
  const start = new Date(nersc.time_submitted)
  const end = nersc.time_started ? new Date(nersc.time_started) : new Date()

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''

  const diffMs = end.getTime() - start.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours.toFixed(2)
}

const getRunTimeInHours = (nersc: INerscInfo | undefined) => {
  if (!nersc?.time_started || !nersc?.time_completed) return ''
  const start = new Date(nersc.time_started)
  const end = new Date(nersc.time_completed)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''

  const diffMs = end.getTime() - start.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours.toFixed(2)
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

const Jobs = () => {
  useTitle('BilboMD: Jobs List')

  const { username, isManager, isAdmin } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const typeFilter = searchParams.get('type') || 'All'
  const statusFilter = searchParams.get('status') || 'All'
  const userFilter = searchParams.get('user') || 'All'
  const pageParam = parseInt(searchParams.get('page') || '0', 10)
  const [page, setPage] = useState(pageParam)

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
  // console.log('jobs data --->', jobs)

  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData')

  if (configIsLoading) return <div>Loading config data...jobs</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  const useNersc = config.useNersc?.toLowerCase() === 'true'

  const availableJobTypes = Array.from(
    new Set((jobs ?? []).map((job) => job.mongo?.__t).filter(Boolean))
  ) as IJob['__t'][]

  const jobTypes = ['All', ...availableJobTypes]

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
          <MenuItem key={type} value={type}>
            {type === 'All'
              ? 'All'
              : (jobTypeDisplayNames[type as IJob['__t']] ?? type)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const availableStatuses = Array.from(
    new Set((jobs ?? []).map((job) => job.mongo?.status).filter(Boolean))
  ) as string[]

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

  const availableUsers = Array.from(
    new Set((jobs ?? []).map((job) => job.username).filter(Boolean))
  )

  const userFilterDropdown = (isAdmin || isManager) && (
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

  let content: ReactNode

  if (isLoading) content = <CircularProgress />

  if (isError) {
    let errorMessage: string = ''
    let severity: 'error' | 'warning' | 'info' = 'info'

    if (error && 'status' in error) {
      if (error.status === 204) {
        console.log(error)
        errorMessage = 'No jobs found. Please run some jobs first.'
        severity = 'info'
      } else if (error.status === 404) {
        errorMessage = 'User not found. Please contact support.'
        severity = 'error'
      } else {
        errorMessage =
          'error' in error ? error.error : JSON.stringify(error.data)
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

  if (isSuccess) {
    let filteredIds: BilboMDJob[]

    if (isManager || isAdmin) {
      filteredIds = [...jobs]
    } else {
      filteredIds = jobs.filter((job) => job.username === username)
    }

    if (typeFilter !== 'All') {
      filteredIds = filteredIds.filter((job) => job.mongo?.__t === typeFilter)
    }
    if (statusFilter !== 'All') {
      filteredIds = filteredIds.filter(
        (job) => job.mongo?.status === statusFilter
      )
    }
    if ((isAdmin || isManager) && userFilter !== 'All') {
      filteredIds = filteredIds.filter((job) => job.username === userFilter)
    }

    const rows = filteredIds.map((job) => {
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
      { field: 'title', headerName: 'Title', flex: 0.5 },
      {
        field: 'time_submitted',
        headerName: 'Submitted',
        type: 'dateTime',
        flex: 0.6,
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
        flex: 0.6,
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
              headerName: 'Queue Time (hrs)',
              width: 130
            },
            {
              field: 'runTimeHours',
              headerName: 'Run Time (hrs)',
              width: 130
            }
          ]
        : []),
      { field: 'username', headerName: 'User', width: 130 },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
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
              width: 100
            },
            {
              field: 'nerscStatus',
              headerName: 'NERSC Status',
              width: 100
            }
          ]
        : [
            {
              field: 'position',
              headerName: 'Position',
              width: 100
            }
          ]),
      {
        field: 'actions',
        type: 'actions',
        sortable: false,
        headerName: 'Manage',
        width: 150,
        getActions: (params: GridRowParams) => {
          if (
            params.row.status !== 'Submitted' &&
            params.row.status !== 'Running'
          ) {
            return [
              <DeleteJob
                key={params.id}
                id={params.row.id}
                title={params.row.title}
                hide={false}
              />,
              <JobDetails
                key={params.id}
                id={params.row.id}
                title={params.row.title}
              />
            ]
          } else {
            return [
              <DeleteJob
                key={params.id}
                id={params.row.id}
                title={params.row.title}
                hide={true}
              />,
              <JobDetails
                key={params.id}
                id={params.row.id}
                title={params.row.title}
              />
            ]
          }
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
          <Grid>
            <NerscStatus />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>Jobs</Typography>
          </HeaderBox>

          <Item>
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
                  width: 'calc(100vw - 260px)',
                  overflow: 'hidden',
                  '& .bilbomd.completed': {
                    backgroundColor: green[500],
                    color: '#1a3e72',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  },
                  '& .bilbomd.error': {
                    backgroundColor: red[600],
                    color: '#1a3e72',
                    fontWeight: '600'
                  },
                  '& .bilbomd.running': {
                    backgroundColor: amber[200],
                    color: '#1a3e72',
                    fontWeight: '600'
                  },
                  '& .bilbomd.submitted': {
                    backgroundColor: amber[100],
                    color: '#1a3e72',
                    fontWeight: '600'
                  },
                  '& .bilbomd.pending': {
                    backgroundColor: green[100],
                    color: '#1a3e72',
                    fontWeight: '500'
                  },
                  '& .bilbomd.failed': {
                    backgroundColor: red[300],
                    color: '#1a3e72',
                    fontWeight: '600'
                  },
                  '& .bilbomd.cancelled': {
                    backgroundColor: grey[200],
                    color: '#616161',
                    fontStyle: 'italic',
                    fontWeight: '500'
                  },
                  '& .bilbomd.unknown': {
                    backgroundColor: '#f3e5f5',
                    color: '#4a148c',
                    fontWeight: '500'
                  }
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
                    initialState={{
                      pagination: { paginationModel: { pageSize: 20, page } }
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
  }

  return content
}

export default Jobs
