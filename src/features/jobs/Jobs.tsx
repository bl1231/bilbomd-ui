import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format, parseISO } from 'date-fns'
import { useGetJobsQuery } from './jobsApiSlice'
import useTitle from 'hooks/useTitle'
import { clsx } from 'clsx'
import { Box } from '@mui/system'
import { green, red, amber } from '@mui/material/colors'
import useAuth from '../../hooks/useAuth'
import {
  Alert,
  AlertTitle,
  CircularProgress,
  Grid,
  Paper,
  Typography
} from '@mui/material'
import DeleteJob from './DeleteJob'
import JobDetails from './JobDetails'
import BullMQSummary from '../bullmq/BullMQSummary'
import HeaderBox from 'components/HeaderBox'

const Jobs = () => {
  useTitle('BilboMD: Jobs List')

  const { username, isManager, isAdmin } = useAuth()

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

  let content

  if (isLoading) content = <CircularProgress />

  if (isError) {
    let errorMessage: string = ''

    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      if (error.status === 404) {
        errorMessage = 'No jobs found. Please run some jobs first.'
      } else {
        errorMessage = 'error' in error ? error.error : JSON.stringify(error.data)
      }
    } else {
      errorMessage = 'Call Scott'
    }

    content = (
      <Box>
        <Alert severity="info" variant="outlined">
          <AlertTitle>{errorMessage}</AlertTitle>
        </Alert>
      </Box>
    )
  }

  if (isSuccess) {
    let filteredIds

    if (isManager || isAdmin) {
      filteredIds = [...jobs]
    } else {
      filteredIds = jobs.filter((job) => job.username === username)
    }

    const rows = filteredIds

    const columns: GridColDef[] = [
      { field: 'title', headerName: 'Title', width: 180 },
      {
        field: 'time_submitted',
        headerName: 'Submitted',
        type: 'dateTime',
        width: 160,
        valueFormatter: (params) => {
          if (params?.value) {
            //console.log(params);
            return format(parseISO(params?.value), 'MM/dd/yyyy HH:mm:ss')
          } else {
            return ''
          }
        }
      },
      {
        field: 'time_completed',
        headerName: 'Completed',
        type: 'dateTime',
        width: 160,
        valueFormatter: (params) => {
          if (params?.value) {
            return format(parseISO(params?.value), 'MM/dd/yyyy HH:mm:ss')
          } else {
            return ''
          }
        }
      },

      { field: 'username', headerName: 'User' },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
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
      { field: 'position', headerName: 'Queue Position' },

      {
        field: 'actions',
        type: 'actions',
        sortable: false,
        headerName: 'Manage',
        getActions: (params) => [
          <DeleteJob key={params.id} job={params.row} />,
          <JobDetails key={params.id} job={params.row} />
        ]
      }
    ]

    content = (
      <>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <BullMQSummary />
          </Grid>
          {rows.length !== 0 ? (
            <Grid item xs={12}>
              <HeaderBox>
                <Typography>BilboMD Jobs</Typography>
              </HeaderBox>
              <Paper>
                <Box
                  sx={{
                    width: '100%',
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
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5
                        }
                      }
                    }}
                    pageSizeOptions={[5, 10, 15, 25]}
                  />
                </Box>
              </Paper>
            </Grid>
          ) : (
            <Box sx={{ height: 600 }}>
              <Alert severity="info" variant="outlined">
                <AlertTitle>No BilboMD Jobs found.</AlertTitle>Run some jobs first
              </Alert>
            </Box>
          )}
        </Grid>
      </>
    )
  }

  return content
}

export default Jobs
