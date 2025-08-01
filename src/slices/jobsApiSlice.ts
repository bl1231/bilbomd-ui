import { createEntityAdapter, createSelector, EntityId } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
import { BilboMDJob } from 'types/interfaces'
import { FileCheckResult } from 'types/jobCheckResults'
import { RootState } from 'app/store'

const jobsAdapter = createEntityAdapter<BilboMDJob>()

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
          return jobsAdapter.getInitialState()
        }
        const loadedJobs = responseData.map((job) => {
          job.mongo.id = job.mongo._id
          job.id = job.mongo._id
          return job
        })
        return jobsAdapter.setAll(initialState, loadedJobs)
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Job', id: 'LIST' },
              ...result.ids.map((id: EntityId) => ({
                type: 'Job' as const,
                id
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
        responseData.id = responseData.mongo._id
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
      // Optimistically remove the job from the cache before the server confirms deletion.
      // If the server request fails, the rollback mechanism (patchResult.undo())
      // restores the cache to its previous state.
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          jobsApiSlice.util.updateQueryData('getJobs', undefined, (draft) => {
            if ('ids' in draft && 'entities' in draft) {
              jobsAdapter.removeOne(draft, id)
            }
          })
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error('Error occurred during job deletion:', error)
          patchResult.undo()
        }
      },
      invalidatesTags: (_, __, arg) => [{ type: 'Job', id: arg.id }]
    }),
    checkJobFiles: builder.query<FileCheckResult, string>({
      query: (id: string) => ({
        url: `/jobs/${id}/check-files`,
        method: 'GET'
      })
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
    getAf2PaeConstFile: builder.query<string, string>({
      query: (uuid) => ({
        url: `af2pae?uuid=${uuid}`,
        method: 'GET',
        responseHandler: 'text'
      }),
      transformResponse(baseQueryReturnValue: string) {
        // console.log('Received const.inp file:', baseQueryReturnValue)
        return baseQueryReturnValue
      }
    }),
    getAf2PaeStatus: builder.query({
      query: (uuid: string) => ({
        url: `/af2pae/status?uuid=${uuid}`,
        method: 'GET'
      })
    }),
    getFileByIdAndName: builder.query<string, { id: string; filename: string }>(
      {
        query: ({ id, filename }) => ({
          url: `/jobs/${id}/${filename}`,
          method: 'GET',
          responseHandler: (response) => response.blob()
        }),
        async transformResponse(baseQueryReturnValue: Blob) {
          const text = await baseQueryReturnValue.text()
          return text
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
  useCheckJobFilesQuery,
  useCalculateAutoRgMutation,
  useAddNewAutoJobMutation,
  useAddNewAlphaFoldJobMutation,
  useAddNewSANSJobMutation,
  useAddNewScoperJobMutation,
  useAddNewMultiJobMutation,
  useAf2PaeJiffyMutation,
  useGetAf2PaeConstFileQuery,
  useGetAf2PaeStatusQuery,
  useGetFileByIdAndNameQuery,
  useLazyGetFileByIdAndNameQuery
} = jobsApiSlice

// Select the query result object from the cache
export const selectJobsResult =
  jobsApiSlice.endpoints.getJobs.select('jobsList')

// Memoized selector to get the normalized jobs data (if available)
const selectJobsData = createSelector(
  selectJobsResult,
  (jobsResult) => jobsResult.data ?? initialState
)

// Export selectors for use in components
export const {
  selectAll: selectAllJobs,
  selectById: selectJobById,
  selectIds: selectJobIds
} = jobsAdapter.getSelectors<RootState>((state) => selectJobsData(state))
