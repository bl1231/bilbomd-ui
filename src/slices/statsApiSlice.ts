import { apiSlice } from 'app/api/apiSlice'

interface Stats {
  userCount: number
  jobCount: number
  totalJobsFromUsers: number
  jobTypes: Record<string, number>
}

export const statsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => ({
        url: '/stats',
        method: 'GET'
      }),
      transformResponse: (response: { success: boolean; data: Stats }) =>
        response.data,
      providesTags: ['Stats']
    })
  })
})

export const { useGetStatsQuery } = statsApiSlice
