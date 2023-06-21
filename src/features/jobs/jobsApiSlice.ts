import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
// import { RootState } from 'app/store'

interface Job {
  id: string
  _id: string
  conformational_sampling: number
  const_inp_file: string
  crd_file: string
  createdAt: string
  data_file: string
  psf_file: string
  rg_max: number
  rg_min: number
  status: string
  time_completed: string
  time_started: string
  time_submitted: string
  title: string
  updatedAt: string
  user: string
  username: string
  uuid: string
}

const jobsAdapter = createEntityAdapter({})

const initialState = jobsAdapter.getInitialState()

export const jobsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => ({
        url: '/jobs',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      transformResponse: (responseData: Job[]) => {
        const loadedJobs = responseData.map((job) => {
          job.id = job._id
          return job
        })
        jobsAdapter.setAll(initialState, loadedJobs)
        return loadedJobs
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Job', id: 'LIST' },
              ...(result as Job[]).map((job) => ({ type: 'Job' as const, id: job.id }))
            ]
          : [{ type: 'Job', id: 'LIST' }]
    }),
    addNewJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs',
        method: 'POST',
        body: newJob
        // headers: { 'Content-Type': 'multipart/form-data' }
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }]
    }),
    updateJob: builder.mutation({
      query: (initialJob) => ({
        url: '/jobs',
        method: 'PATCH',
        body: {
          ...initialJob
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Job', id: arg.id }]
    }),
    deleteJob: builder.mutation({
      query: ({ id }) => ({
        url: `/jobs`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Job', id: arg.id }]
    })
  })
})

export const {
  useGetJobsQuery,
  useAddNewJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation
} = jobsApiSlice

// returns the query result object
export const selectJobsResult = jobsApiSlice.endpoints.getJobs.select({})

// creates memoized selector
// const selectJobsData = createSelector(
//   selectJobsResult,
//   (jobsResult) => jobsResult.data // normalized state object with ids & entities
// )

//getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllJobs,
//   selectById: selectJobById,
//   selectIds: selectJobIds
//   // Pass in a selector that returns the jobs slice of state
// } = jobsAdapter.getSelectors((state: RootState) => selectJobsData(state) ?? initialState)
