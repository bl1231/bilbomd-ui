import { ReactNode } from 'react'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { format, parseISO } from 'date-fns'
import { useGetJobsQuery } from 'slices/jobsApiSlice'
import useTitle from 'hooks/useTitle'
import { clsx } from 'clsx'
import { Box } from '@mui/system'
import { green, red, amber } from '@mui/material/colors'
import useAuth from 'hooks/useAuth'
import {
  Alert,
  AlertTitle,
  CircularProgress,
  Paper,
  Typography,
  LinearProgress
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { styled } from '@mui/material/styles'
import DeleteJob from './DeleteJob'
import JobDetails from './JobDetails'
import BullMQSummary from '../bullmq/BullMQSummary'
import NerscStatus from '../nersc/NerscStatus'
import HeaderBox from 'components/HeaderBox'
import { BilboMDJob } from 'types/interfaces'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const Jobs = () => {
  useTitle('BilboMD: Jobs List')

  const { username, isManager, isAdmin } = useAuth()

  const {
    data: jobs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetJobsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  // console.log('jobs data --->', jobs)

  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})
  if (configIsLoading) return <div>Loading config data...</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  // console.log(`jobs --> config: ${JSON.stringify(config)}`)
  const useNersc = config.useNersc?.toLowerCase() === 'true'

  // useEffect(() => {
  //   const logEnvVariables = () => {
  //     Object.keys(import.meta.env).forEach((key) => {
  //       console.log(`${key}: ${import.meta.env[key]}`)
  //     })
  //   }
  //   logEnvVariables()
  // }, [])

  let content: ReactNode

  if (isLoading) content = <CircularProgress />

  if (isError) {
    let errorMessage: string = ''
    let severity: 'error' | 'warning' | 'info' = 'info'

    if (error && 'status' in error) {
      if (error.status === 204) {
        // No jobs available, but user exists
        console.log(error)
        errorMessage = 'No jobs found. Please run some jobs first.'
        severity = 'info'
      } else if (error.status === 404) {
        // User not found
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

    const rows = filteredIds.map((job) => {
      const nerscJobid = job.mongo.nersc?.jobid || ''
      const nerscStatus = job.mongo.nersc?.state || ''

      return {
        ...job.mongo,
        position: job.bullmq?.queuePosition ?? '',
        username: job.username,
        nerscJobid: nerscJobid,
        nerscStatus: nerscStatus,
        progress: job.mongo.progress
      }
    })

    // console.log('ROWS--->', rows)

    const columns: GridColDef[] = [
      { field: 'title', headerName: 'Title', width: 180 },
      {
        field: 'time_submitted',
        headerName: 'Submitted',
        type: 'dateTime',
        width: 150,
        valueFormatter: (value) => {
          if (value) {
            // Check if value is not empty or null
            return format(parseISO(value), 'MM/dd/yyyy HH:mm:ss')
          } else {
            return '' // Return empty string if value is empty or null
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
            // Check if value is not empty or null
            return format(parseISO(value), 'MM/dd/yyyy HH:mm:ss')
          } else {
            return '' // Return empty string if value is empty or null
          }
        }
      },

      { field: 'username', headerName: 'User' },
      {
        field: 'status',
        headerName: 'Status',
        width: 90,
        cellClassName: (params) => {
          if (params.value == null) {
            return ''
          }
          return clsx('bilbomd', {
            submitted: params.value === 'Submitted',
            running: params.value === 'Running',
            error: params.value === 'Error',
            completed: params.value === 'Completed'
          })
        }
      },
      {
        field: 'progress',
        headerName: 'Progress',
        width: 150,
        renderCell: (params) => {
          if (params.value === undefined || params.value === null) {
            return null // Hide progress bar if progress is not available
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
      {
        field: 'position',
        headerName: 'Position',
        width: 150
      },
      {
        field: 'nerscJobid',
        headerName: 'NERSC JobID',
        width: 110
      },
      {
        field: 'nerscStatus',
        headerName: 'NERSC Status',
        width: 110
      },

      {
        field: 'actions',
        type: 'actions',
        sortable: false,
        headerName: 'Manage',
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
      <Grid container spacing={4}>
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

        {rows.length !== 0 ? (
          <Grid size={{ xs: 12 }}>
            <HeaderBox>
              <Typography>Jobs</Typography>
            </HeaderBox>
            <Item>
              <Box
                sx={{
                  '& .bilbomd.completed': {
                    backgroundColor: green[400],
                    color: '#1a3e72',
                    fontWeight: '800'
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
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '99%'
                  }}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10
                        }
                      },
                      columns: {
                        columnVisibilityModel: {
                          position: !useNersc,
                          nerscJobid: useNersc,
                          nerscStatus: useNersc
                        }
                      }
                    }}
                    pageSizeOptions={[5, 10, 15, 25]}
                  />
                </Box>
              </Box>
            </Item>
          </Grid>
        ) : (
          <Grid size={{ xs: 12 }}>
            <HeaderBox>
              <Typography>Jobs</Typography>
            </HeaderBox>
            <Alert severity='info' variant='outlined'>
              <AlertTitle>No Jobs found.</AlertTitle>Run some jobs first
            </Alert>
          </Grid>
        )}
      </Grid>
    )
  }

  return content
}

export default Jobs
