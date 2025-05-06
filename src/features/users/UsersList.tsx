import { useGetUsersQuery } from 'slices/usersApiSlice'
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router'
import { CircularProgress, Typography, Alert } from '@mui/material'
import HeaderBox from 'components/HeaderBox'
import Item from 'themes/components/Item'
import BoxDataGridWrapper from 'themes/components/BoxDataGridWrapper'

type ContentType = React.ReactNode | string

const UsersList = () => {
  useTitle('BilboMD: Users List')
  const navigate = useNavigate()
  const {
    data: users,
    isLoading,
    isSuccess,
    isError
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content: ContentType

  if (isLoading) {
    content = <CircularProgress />
  }

  if (isError) {
    // console.error('Error fetching users:', error)
    content = (
      <Alert severity='error' variant='outlined'>
        An error occurred while fetching users.
      </Alert>
    )
  }

  if (isSuccess && users && Array.isArray(users)) {
    // console.log('Users:', users)
    const columns: GridColDef[] = [
      { field: 'username', headerName: 'Username' },
      { field: 'email', headerName: 'Email', width: 180 },
      { field: 'roles', headerName: 'Roles', width: 140 },
      { field: 'active', headerName: 'Active' },
      {
        field: 'actions',
        headerName: 'Edit',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon />}
            label='Edit'
            onClick={() => navigate(params.id as string)}
          />
        ]
      }
    ]

    content = (
      <BoxDataGridWrapper>
        <Box>
          <HeaderBox>
            <Typography>Users</Typography>
          </HeaderBox>
          <Item>
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[5, 10, 15, 25]}
            />
          </Item>
        </Box>
      </BoxDataGridWrapper>
    )
  }

  if (isSuccess && (!users || !Array.isArray(users))) {
    // console.warn('Unexpected data format for users:', users)
    content = (
      <Typography color='error'>
        No users available or data format is invalid.
      </Typography>
    )
  }

  return content || null
}
export default UsersList
