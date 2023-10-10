import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
import { Job } from 'types/interfaces'

const jobsAdapter = createEntityAdapter({})

const initialState = jobsAdapter.getInitialState()

export const jobsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => ({
        url: '/jobs',
        method: 'GET',
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
        url: `/jobs/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Job', id: arg.id }]
    }),
    addNewAutoJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs/biblomd-auto',
        method: 'POST',
        body: newJob
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }]
    })
  })
})

export const {
  useGetJobsQuery,
  useAddNewJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useAddNewAutoJobMutation
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
