import { store } from 'app/store'
import { jobsApiSlice } from 'features/jobs/jobsApiSlice'
import { usersApiSlice } from 'features/users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing')
    store.dispatch(jobsApiSlice.util.prefetch('getJobs', 'jobsList', { force: true }))
    store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
  }, [])

  return <Outlet />
}
export default Prefetch
