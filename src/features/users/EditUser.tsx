import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'

// interface data {
//   entities: [id: number]
// }

const EditUser = () => {
  useTitle('BilboMD: Edit User')

  const { id } = useParams()

  const { user } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      // user: data?.entities[id]
      user: data?.find((user) => user.id === id)
    })
  })

  if (!user) return <PulseLoader color={'#222'} />

  const content = <EditUserForm user={user} />

  return content
}
export default EditUser
