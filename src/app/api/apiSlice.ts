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
  // This guard ensures `args` is of type FetchArgs
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

      // Return the result of the original query
      return result
    } else if (refreshResult?.error?.status === 403) {
      console.error(
        'Refresh token expired or invalid:',
        refreshResult.error.data
      )
    }
    return refreshResult
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Job', 'User', 'Config', 'FoxsAnalysis'],
  endpoints: () => ({})
})
