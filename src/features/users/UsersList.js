import { useGetUsersQuery } from './usersApiSlice'
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRowParams,
  GridValueFormatterParams,
  GridActionsCellItem
} from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/Edit'
import useTitle from '../../hooks/useTitle'
import PulseLoader from 'react-spinners/PulseLoader'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { Button, Link } from '@mui/material'

const UsersList = () => {
  useTitle('BilboMD: Users List')
  const navigate = useNavigate()
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  const handleEdit = (id) => navigate(`/dashboard/users/${id}`)
  let content

  if (isLoading) content = <PulseLoader color={'#FFF'} />

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = users

    const rows = ids?.length && ids.map((userId) => entities[userId])
    console.log(rows)

    const columns: GridColDef[] = [
      { field: 'username', headerName: 'Username' },
      { field: 'email', headerName: 'Email', width: 180 },
      { field: 'roles', headerName: 'Roles', width: 140 },
      { field: 'active', headerName: 'Active' },
      {
        field: 'actions',
        headerName: 'edit',
        type: 'actions',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            component={Button}
            variant="contained"
            onClick={() => navigate(`/dashboard/users/${params.id}`)}
          />
        ]
      }
    ]

    //const handleEdit = (id) => navigate(`/dashboard/users/${id}`)

    content = (
      <Box sx={{ height: 600 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    )
  }

  return content
}
export default UsersList
