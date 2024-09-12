import { store } from 'app/store'
import { jobsApiSlice } from 'slices/jobsApiSlice'
import { usersApiSlice } from 'slices/usersApiSlice'
import { bullmqApiSlice } from 'features/bullmq/bullmqApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
  useEffect(() => {
    // console.log('subscribing')
    store.dispatch(
      jobsApiSlice.util.prefetch('getJobs', 'jobsList', { force: true })
    )
    store.dispatch(
      usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true })
    )
    store.dispatch(
      bullmqApiSlice.util.prefetch('getQueueState', 'queueList', {
        force: true
      })
    )
  }, [])

  return <Outlet />
}
export default Prefetch
