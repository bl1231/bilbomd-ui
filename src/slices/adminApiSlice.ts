import { apiSlice } from 'app/api/apiSlice'

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQueues: builder.query({
      query: () => '/admin/queues',
      providesTags: ['AdminQueue']
    }),
    pauseQueue: builder.mutation({
      query: (queueName: string) => ({
        url: `/admin/queues/${queueName}/pause`,
        method: 'POST'
      }),
      invalidatesTags: ['AdminQueue']
    }),
    resumeQueue: builder.mutation({
      query: (queueName: string) => ({
        url: `/admin/queues/${queueName}/resume`,
        method: 'POST'
      }),
      invalidatesTags: ['AdminQueue']
    }),
    getJobsByQueue: builder.query({
      query: (queueName: string) => `/admin/queues/${queueName}/jobs`
    }),
    retryQueueJob: builder.mutation({
      query: ({ queueName, jobId }: { queueName: string; jobId: string }) => ({
        url: `/admin/queues/${queueName}/jobs/${jobId}/retry`,
        method: 'POST'
      }),
      invalidatesTags: ['AdminQueue']
    }),
    deleteQueueJob: builder.mutation({
      query: ({ queueName, jobId }: { queueName: string; jobId: string }) => ({
        url: `/admin/queues/${queueName}/jobs/${jobId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminQueue']
    }),
    drainQueue: builder.mutation({
      query: (queueName: string) => ({
        url: `/admin/queues/${queueName}/drain`,
        method: 'POST'
      }),
      invalidatesTags: ['AdminQueue']
    }),
    failQueueJob: builder.mutation({
      query: ({ queueName, jobId }: { queueName: string; jobId: string }) => ({
        url: `/admin/queues/${queueName}/jobs/${jobId}/fail`,
        method: 'POST'
      }),
      invalidatesTags: ['AdminQueue']
    })
  })
})

export const {
  useGetQueuesQuery,
  usePauseQueueMutation,
  useResumeQueueMutation,
  useGetJobsByQueueQuery,
  useRetryQueueJobMutation,
  useDeleteQueueJobMutation,
  useDrainQueueMutation,
  useFailQueueJobMutation
} = adminApiSlice
