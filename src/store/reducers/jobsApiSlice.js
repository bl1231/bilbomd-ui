import { apiSlice } from './apiSlice';

export const jobsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => '/jobs',
      providesTags: ['Jobs']
    }),
    addJob: builder.mutation({
      query: (job) => ({
        url: '/jobs',
        method: 'POST',
        body: job
      }),
      invalidatesTags: ['Jobs']
    }),
    updateJob: builder.mutation({
      query: (job) => ({
        url: `/jobs/${job.id}`,
        method: 'PATCH',
        body: job
      }),
      invalidatesTags: ['Jobs']
    }),
    deleteJob: builder.mutation({
      query: ({ id }) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
        body: id
      }),
      invalidatesTags: ['Jobs']
    })
  })
});

export const {
  useGetJobsQuery,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation
} = jobsApiSlice;
