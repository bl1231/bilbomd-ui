import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseURL = '/sfapi'

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL
})

export const superfacilityApiSlice = createApi({
  reducerPath: 'superfacilityApi',
  baseQuery: baseQuery,
  tagTypes: ['Status', 'Project'],
  endpoints: () => ({})
})
