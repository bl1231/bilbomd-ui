import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridValueFormatterParams,
  GridActionsCellItem
} from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
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
    pdbs: [{ name: '' }],
    constinp: '',
    expdata: '',
    num_conf: '',
    rg_min: '',
    rg_max: '',
    uuid: '',
    status: '',
    message: '',
    submitted: '',
    completed: ''
  }
];

export default function JobTable() {
  const [jobs, setJobs] = useState(emptyJob);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3333/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const deleteJob = useCallback(
    (id) => () => {
      setTimeout(() => {
        console.log('delete: ', id);
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
      });
    },
    []
  );

  const viewJob = useCallback(
    (id) => () => {
      setTimeout(() => {
        console.log('view: ', id);
        navigate(`/job/${id}`);
      });
    },
    []
  );

  const columns = useMemo(
    () => [
      { field: 'uuid', type: 'string', headerName: 'UUID', width: 70 },
      {
        field: 'submitted',
        type: 'dateTime',
        width: 160,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          if (params?.value) {
            //console.log(params);
            return format(parseISO(params?.value), 'MM/dd/yyyy HH:mm:ss');
          } else {
            return '--/--/-- 00:00:00';
          }
        }
      },
      {
        field: 'completed',
        type: 'dateTime',
        width: 160,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          if (params?.value) {
            return format(parseISO(params?.value), 'MM/dd/yyyy HH:mm:ss');
          } else {
            return '--/--/-- 00:00:00';
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
            onClick={deleteJob(params.id)}
          />,
          <GridActionsCellItem
            icon={<InfoIcon />}
            label="View"
            onClick={viewJob(params.id)}
          />
        ]
      },
      {
        field: 'test',
        headerName: 'Test',
        width: 60,
        renderCell: (params) => <Link to={`/job/${params.id}`}>VIEW</Link>
      }
    ],
    [deleteJob, viewJob]
  );

  return (
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
        rows={jobs}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.uuid}
      />
    </Box>
  );
}
