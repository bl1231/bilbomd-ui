import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseURL = '/sfapi'

// RTK Query's baseQuery with OAuth2 token
const baseQuery = fetchBaseQuery({
  baseUrl: baseURL
})

// initialize an empty API service that we'll inject endpoints into later as needed
export const superfacilityApiSlice = createApi({
  reducerPath: 'superfacilityApi',
  baseQuery: baseQuery,
  tagTypes: ['Status'],
  endpoints: () => ({})
})
