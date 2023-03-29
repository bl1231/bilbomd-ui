import React from 'react'
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridValueFormatterParams
} from '@mui/x-data-grid'
import { format, parseISO } from 'date-fns'
import { useGetJobsQuery } from './jobsApiSlice'
// import { useNavigate } from 'react-router-dom'
import useTitle from 'hooks/useTitle'
import clsx from 'clsx'
import { Box } from '@mui/system'
import { green, red, amber } from '@mui/material/colors'
import useAuth from '../../hooks/useAuth'
import { CircularProgress } from '@mui/material'
import DeleteJob from './DeleteJob'
import InfoJob from './InfoJob'

const JobsList = () => {
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
    content = <p className="errmsg">{error?.data?.message}</p>
  }
  if (isSuccess) {
    const { ids, entities } = jobs

    // This is some magic shit. Why do I find map so difficult to understand?
    // This is where we will need to filter the jobs so that Users only see
    // their jobs NOT all jobs.
    // apparently ids is iterable and entities is NOT --- ned ref for this.

    let filteredIds
    if (isManager || isAdmin) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter((jobId) => entities[jobId].username === username)
    }

    const rows = ids?.length && filteredIds.map((jobId) => entities[jobId])

    const columns: GridColDef[] = [
      { field: 'title', headerName: 'Title', width: 200 },
      { field: 'id', headerName: 'ID', width: 100, hide: true },
      {
        field: 'time_submitted',
        headerName: 'Submitted',
        type: 'dateTime',
        width: 160,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
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
        valueFormatter: (params: GridValueFormatterParams<string>) => {
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
        cellClassName: (params: GridCellParams<string>) => {
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
        getActions: (params: GridRowParams) => [
          <DeleteJob job={params.row} />,
          <InfoJob job={params.row} />
        ]
      }
    ]

    content = (
      <Box
        sx={{
          height: 600,
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
          pageSize={8}
          rowsPerPageOptions={[8]}
          //checkboxSelection
          //getRowId={(row) => row._id}
        />
      </Box>
    )
  }

  return content
}

export default JobsList
