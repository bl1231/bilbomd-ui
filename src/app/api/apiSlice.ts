import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
  BaseQueryFn
} from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../slices/authSlice'
import type { RootState } from '../store'

const baseURL = '/api/v1'

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Ensure `args` is of type FetchArgs
  const fetchArgs: FetchArgs =
    typeof args === 'string'
      ? { url: args }
      : args.url
        ? args
        : (() => {
            throw new Error('Missing URL in FetchArgs')
          })()

  let result = await baseQuery(fetchArgs, api, extraOptions)

  if (result?.error?.status === 403) {
    // Attempt to refresh the token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data as { accessToken: string }
      api.dispatch(setCredentials({ accessToken }))

      // Retry original query
      result = await baseQuery(fetchArgs, api, extraOptions)
    } else if (refreshResult?.error?.status === 403) {
      console.error(
        'Refresh token expired or invalid:',
        refreshResult.error.data
      )
    }
    return refreshResult
  }

  if (result?.error?.status === 401) {
    console.error('Unauthorized - consider logging out the user')
    // Optionally dispatch a logout or show a notification
  }

  return result
}

// initialize an empty api service that we'll inject endpoints into later as needed
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Job', 'User', 'FoxsAnalysis'],
  endpoints: () => ({})
})
