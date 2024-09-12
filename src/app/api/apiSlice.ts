import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
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

interface RefreshErrorData {
  message: string
  // Add other properties if necessary
}
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  // console.log('baseQueryWithReauth result:', result)
  if (result?.error?.status === 403) {
    // console.log('sending refresh token')

    // send refreshToken to get new accessToken
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    // console.log('refreshResult:', refreshResult)
    if (refreshResult?.data) {
      // store the new accessToken
      api.dispatch(setCredentials({ ...refreshResult.data }))
      // retry the original query with new accessToken
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        const errorData = refreshResult.error.data as RefreshErrorData
        errorData.message = 'Your login has expired.'
      }
      return refreshResult
    }
  } else if (result?.error?.status === 'PARSING_ERROR') {
    // Handle the parsing error specifically
    console.error('Parsing error encountered', result.error)
    // Reload the entire application
    // window.location.reload()

    // Optionally, trigger an application-wide action, such as logging out the user,
    // showing an error message, or even reloading the app (be cautious with this approach).
    // For example, to log out:
    // api.dispatch(logOutUser());

    // Or to notify the user somehow, adjust according to your application's state management.

    // Depending on your application's needs, you might return something specific here,
    // or perhaps adjust `result` to reflect a new state after handling the error.
  }

  return result
}

// initialize an empty api service that we'll inject endpoints into later as needed
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Job', 'User', 'FoxsAnalysis'],
  endpoints: () => ({})
})
