import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
import { BilboMDJob } from 'types/interfaces'

const jobsAdapter = createEntityAdapter({})

const initialState = jobsAdapter.getInitialState()

export const jobsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => ({
        url: '/jobs',
        method: 'GET'
      }),
      transformResponse: (responseData: BilboMDJob[]) => {
        // Handle the case where there's no content (204)
        if (!responseData || responseData.length === 0) {
          return [] // Return an empty array if there are no jobs
        }
        const loadedJobs = responseData.map((job) => {
          job.mongo.id = job.mongo._id
          job.id = job.mongo._id as string
          return job
        })
        jobsAdapter.setAll(initialState, loadedJobs)
        return loadedJobs
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Job', id: 'LIST' },
              ...result.map((job) => ({
                type: 'Job' as const,
                id: job.mongo.id
              }))
            ]
          : [{ type: 'Job', id: 'LIST' }]
    }),
    getJobById: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'GET'
      }),
      transformResponse: (responseData: BilboMDJob) => {
        responseData.mongo.id = responseData.mongo._id
        responseData.id = responseData.mongo._id as string
        return responseData
      },
      providesTags: (_, __, id) => [{ type: 'Job', id }]
    }),
    getFoxsAnalysisById: builder.query({
      query: (id) => ({
        url: `/jobs/${id}/results/foxs`,
        method: 'GET'
      }),
      providesTags: (_, __, id) => [{ type: 'FoxsAnalysis', id }]
    }),
    addNewJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs',
        method: 'POST',
        body: newJob
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
      invalidatesTags: (_, __, arg) => [{ type: 'Job', id: arg.id }]
    }),
    deleteJob: builder.mutation({
      query: ({ id }) => ({
        url: `/jobs/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, arg) => [{ type: 'Job', id: arg.id }]
    }),
    calculateAutoRg: builder.mutation({
      query: (formData: FormData) => ({
        url: '/autorg',
        method: 'POST',
        body: formData
      })
    }),
    addNewAutoJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs/bilbomd-auto',
        method: 'POST',
        body: newJob
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }]
    }),
    addNewAlphaFoldJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs/bilbomd-alphafold',
        method: 'POST',
        body: newJob
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }]
    }),
    addNewSANSJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs/bilbomd-sans',
        method: 'POST',
        body: newJob
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }]
    }),
    addNewScoperJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs/bilbomd-scoper',
        method: 'POST',
        body: newJob
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }]
    }),
    addNewMultiJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs/bilbomd-multi',
        method: 'POST',
        body: newJob
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }]
    }),
    af2PaeJiffy: builder.mutation({
      query: (formData: FormData) => ({
        url: '/af2pae',
        method: 'POST',
        body: formData
      })
    }),
    getAf2PaeConstFile: builder.query({
      query: (uuid) => ({
        url: `af2pae?uuid=${uuid}`,
        method: 'GET',
        // `fetchBaseQuery` returns a Response object by default.
        // We can transform the response in the `transformResponse` option,
        // or handle it after the query returns.
        responseHandler: (response) => response.blob()
      }),
      async transformResponse(baseQueryReturnValue: Blob) {
        const text = await baseQueryReturnValue.text()
        return text
      }
    }),
    getFileByIdAndName: builder.query<string, { id: string; filename: string }>(
      {
        query: ({ id, filename }) => ({
          url: `/jobs/${id}/${filename}`,
          method: 'GET',
          responseHandler: (response) => response.blob() // Return file as Blob
        }),
        async transformResponse(baseQueryReturnValue: Blob) {
          const text = await baseQueryReturnValue.text()
          return text // Transform the Blob to a string (assuming text file)
        }
      }
    )
  })
})

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useGetFoxsAnalysisByIdQuery,
  useAddNewJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useCalculateAutoRgMutation,
  useAddNewAutoJobMutation,
  useAddNewAlphaFoldJobMutation,
  useAddNewSANSJobMutation,
  useAddNewScoperJobMutation,
  useAddNewMultiJobMutation,
  useAf2PaeJiffyMutation,
  useGetAf2PaeConstFileQuery,
  useGetFileByIdAndNameQuery,
  useLazyGetFileByIdAndNameQuery
} = jobsApiSlice

// returns the query result object
// export const selectJobsResult = jobsApiSlice.endpoints.getJobs.select({})
// export const selectJobsResult = jobsApiSlice.endpoints.getJobs.select()

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
