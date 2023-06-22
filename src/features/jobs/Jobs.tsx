import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format, parseISO } from 'date-fns'
import { useGetJobsQuery } from './jobsApiSlice'
import useTitle from 'hooks/useTitle'
import clsx from 'clsx'
import { Box } from '@mui/system'
import { green, red, amber } from '@mui/material/colors'
import useAuth from '../../hooks/useAuth'
import { Alert, AlertTitle, CircularProgress } from '@mui/material'
import DeleteJob from './DeleteJob'
import JobDetails from './JobDetails'

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
    console.log('err:', error)
    // content = <p className="errmsg">{error?.data?.message}</p>
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
      { field: 'title', headerName: 'Title', width: 200 },
      // { field: 'id', headerName: 'ID', width: 100, hide: true },
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

      {
        field: 'actions',
        type: 'actions',
        sortable: false,
        headerName: 'manage',
        getActions: (params) => [
          <DeleteJob key={params.id} job={params.row} />,
          <JobDetails key={params.id} job={params.row} />
        ]
      }
    ]

    content =
      rows.length !== 0 ? (
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
      ) : (
        <Box sx={{ height: 600 }}>
          <Alert severity="info" variant="outlined">
            <AlertTitle>No BilboMD Jobs found.</AlertTitle>Run some jobs first
          </Alert>
        </Box>
      )
  }

  return content
}

export default Jobs
