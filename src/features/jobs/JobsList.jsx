import { useGetJobsQuery } from './jobsApiSlice';
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridValueFormatterParams,
  GridActionsCellItem
} from '@mui/x-data-grid';
import { useState, useCallback, useMemo } from 'react';
import { format, parseISO } from 'date-fns';

import { useSelector } from 'react-redux';
import { selectJobById } from './jobsApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';

import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
// import EditIcon from '@mui/icons-material/Edit';
// import SecurityIcon from '@mui/icons-material/Security';
// import FileCopyIcon from '@mui/icons-material/FileCopy';
import clsx from 'clsx';
import { Box } from '@mui/system';
import { green, red, amber } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';

const emptyJob = [
  {
    title: '',
    uuid: '',
    pdbs: [{ name: '', size: '' }],
    constinp: '',
    expdata: '',
    num_conf: '',
    rg_min: '',
    rg_max: '',
    status: '',
    message: '',
    time_submitted: '',
    time_started: '',
    time_completed: ''
  }
];

const JobsList = () => {
  //const [jobs, setJobs] = useState(emptyJob);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch('http://localhost:3500/jobs')
  //     .then((res) => res.json())
  //     .then((data) => setJobs(data));
  // }, []);

  const {
    data: jobs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetJobsQuery('jobsList', {
    pollingInterval: 0,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

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

  let content;

  if (isLoading) content = <PulseLoader color={'#FFF'} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isSuccess) {
    //console.log('jobs: ', jobs);
    const { ids, entities } = jobs;
    console.log(entities);
    const columns: GridColDef[] = [
      // {
      //   field: 'time_submitted',
      //   type: 'dateTime',
      //   width: 160,
      //   valueFormatter: (params: GridValueFormatterParams<string>) => {
      //     if (params?.value) {
      //       //console.log(params);
      //       return format(parseISO(params?.value), 'MM/dd/yyyy HH:mm:ss');
      //     } else {
      //       return '--/--/-- 00:00:00';
      //     }
      //   }
      // },
      // {
      //   field: 'completed',
      //   type: 'dateTime',
      //   width: 160,
      //   valueFormatter: (params: GridValueFormatterParams<string>) => {
      //     if (params?.value) {
      //       return format(parseISO(params?.value), 'MM/dd/yyyy HH:mm:ss');
      //     } else {
      //       return '--/--/-- 00:00:00';
      //     }
      //   }
      // },
      { field: 'title', headerName: 'Title', width: 200 },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        cellClassName: (params: GridCellParams<string>) => {
          if (params.value == null) {
            return '';
          }
          return clsx('bilbomd', {
            submitted: params.value === 'submitted',
            running: params.value === 'running',
            error: params.value === 'error',
            completed: params.value === 'completed'
          });
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
        renderCell: (params) => <Link to={`/jobs/${params.id}`}>VIEW</Link>
      }
    ];

    content = (
      <Box
        sx={{
          height: 500,
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
          rows={entities}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={(row) => row.id}
        />
      </Box>
    );
  }

  return content;
};

export default JobsList;
