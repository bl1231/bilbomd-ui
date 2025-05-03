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
    })
  })
})

export const {
  useGetQueuesQuery,
  usePauseQueueMutation,
  useResumeQueueMutation
} = adminApiSlice
