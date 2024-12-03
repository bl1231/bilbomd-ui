import { useParams } from 'react-router'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from 'slices/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'

const EditUser = () => {
  useTitle('BilboMD: Edit User')

  const { id } = useParams()

  const { user } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      user: data?.find((user) => user.id === id)
    })
  })

  if (!user) return <PulseLoader color={'#222'} />

  const content = <EditUserForm user={user} />

  return content
}

export default EditUser
