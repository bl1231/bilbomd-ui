import React from 'react'
import NewJobForm from './NewJobForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const NewJob = () => {
  useTitle('BilboMD: New Job')

  // this was modelled after Dave Gray's MERN tutorial
  // where the "Notes" needed a list of all users...
  // I don't think we need this.
  const { users } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id])
    })
  })

  if (!users?.length) return <PulseLoader color={'#FFF'} />

  const content = <NewJobForm />

  return content
}
export default NewJob
