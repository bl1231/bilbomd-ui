import { useParams } from 'react-router'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery, selectUserById } from 'slices/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import { useSelector } from 'react-redux'
import type { RootState } from 'app/store'

const EditUser = () => {
  useTitle('BilboMD: Edit User')

  const { id } = useParams()

  useGetUsersQuery('usersList') // To populate the cache
  const user = useSelector((state: RootState) => selectUserById(state, id!))

  if (!user)
    return (
      <div data-testid='spinner'>
        <PulseLoader color={'#222'} />
      </div>
    )
  const content = <EditUserForm user={user} />

  return content
}

export default EditUser
