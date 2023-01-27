import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueFormatterParams
} from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
import clsx from 'clsx';
import { Box } from '@mui/system';

import { green, red, amber } from '@mui/material/colors';

const columns: GridColDef[] = [
  { field: 'uuid', headerName: 'UUID', width: 70 },
  {
    field: 'submitted',
    type: 'dateTime',
    width: 160,
    valueFormatter: (params: GridValueFormatterParams<string>) => {
      return format(parseISO(params.value), 'MM/dd/yyyy HH:mm:ss');
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
  { field: 'message', headerName: 'Message', width: 160 }
];

export default function JobTable() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3333/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

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
