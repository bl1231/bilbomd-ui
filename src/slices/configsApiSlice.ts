import { apiSlice } from 'app/api/apiSlice'

export const configApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConfigs: builder.query({
      query: () => ({
        url: '/configs',
        method: 'GET'
      })
    })
  })
})

export const { useGetConfigsQuery } = configApiSlice
