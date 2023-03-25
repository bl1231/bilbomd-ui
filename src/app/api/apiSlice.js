import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://bl1231.als.lbl.gov/bilbomd-dev-backend',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  //console.log('args:', args) // request url, method, body
  //console.log('api:', api) // signal, dispatch, getState()
  //console.log('extra:', extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log('sending refresh token')

    // send refreshToken to get new accessToken
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult?.data) {
      // store the new accessToken
      api.dispatch(setCredentials({ ...refreshResult.data }))
      // retry the original query with new accessToken
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = 'Your login has expired. '
      }
      return refreshResult
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Job', 'User'],
  endpoints: (builder) => ({})
})
