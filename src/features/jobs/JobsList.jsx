import { useGetJobsQuery } from './jobsApiSlice'
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridValueFormatterParams,
  GridActionsCellItem
} from '@mui/x-data-grid'
import { useState, useCallback, useMemo } from 'react'
import { format, parseISO } from 'date-fns'

import { useSelector } from 'react-redux'
import { selectJobById } from './jobsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
// import EditIcon from '@mui/icons-material/Edit';
// import SecurityIcon from '@mui/icons-material/Security';
// import FileCopyIcon from '@mui/icons-material/FileCopy';
import clsx from 'clsx'
import { Box } from '@mui/system'
import { green, red, amber } from '@mui/material/colors'
import { Link, useNavigate } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'
import { convertCompilerOptionsFromJson } from 'typescript'

const JobsList = () => {
  useTitle('BilboMD: Jobs List')

  //const { username, isManager, isAdmin } = useAuth()

  const navigate = useNavigate()

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

  //console.log(jobs);
  // const deleteJob = useCallback(
  //   (id) => () => {
  //     setTimeout(() => {
  //       console.log('delete: ', id);
  //       setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  //     });
  //   },
  //   []
  // );

  // const viewJob = useCallback(
  //   (id) => () => {
  //     setTimeout(() => {
  //       console.log('view: ', id);
  //       navigate(`/job/${id}`);
  //     });
  //   },
  //   []
  // );

  let content

  if (isLoading) content = <PulseLoader color={'#FFF'} />

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }
  if (isSuccess) {
    const { ids, entities } = jobs

    //console.log('jobs: ', jobs)
    //console.log(Object.values(jobs))
    //console.log('ids:', ids)
    //console.log('entities:', entities)

    // This is some magic shit. Why do I find map so difficult to understand?
    // This is where we will need to filter the jobs so that Users only see
    // their jobs NOT all jobs.

    const rows = ids?.length ? ids.map((jobId) => entities[jobId]) : []

    console.log(rows)
    const columns: GridColDef[] = [
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
            return '--/--/-- 00:00:00'
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
            return '--/--/-- 00:00:00'
          }
        }
      },
      { field: 'title', headerName: 'Title', width: 200 },
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
        headerName: 'Delete/Details',
        type: 'actions',
        width: 110,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {}}
          />,
          <GridActionsCellItem
            icon={<InfoIcon />}
            label="View"
            onClick={() => {}}
          />
        ]
      },
      {
        field: 'test',
        headerName: 'Test',
        width: 60,
        renderCell: (params) => <Link to={`/dashboard/jobs/${params.id}`}>VIEW</Link>
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
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
          getRowId={(row) => row._id}
        />
      </Box>
    )
  }

  return content
}

export default JobsList
