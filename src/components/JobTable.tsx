import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams
} from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
  { field: 'completed', type: 'dateTime', width: 160 },
  { field: 'title', headerName: 'Title', width: 180 },
  { field: 'status', headerName: 'Status' },
  { field: 'message', headerName: 'Message' }
];

export default function JobTable() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3333/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={jobs}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
