// import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { CircularProgress, Typography, Paper } from '@mui/material'
import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

type ContentType = React.ReactNode | string

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

  let content: ContentType

  if (isLoading) content = <CircularProgress />

  if (isError) {
    console.error('error in UsersList', error)
    // content = <p>{error}</p>
    // content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
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
            label="Edit"
            onClick={() => navigate(params.id as string)}
          />
        ]
      }
    ]

    content = (
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
    )
  }

  return content
}
export default UsersList
