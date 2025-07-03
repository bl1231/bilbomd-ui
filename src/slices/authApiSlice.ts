import { apiSlice } from 'app/api/apiSlice'
import { logOut, setCredentials } from 'slices/authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/otp',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(logOut())
          // Dave Gray suggests this timeout to give components time to unmount before resetting state
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
          console.log('Logout succeeded with response:', data)
        } catch (error) {
          console.log(error)
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET'
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          //console.log(data)
          const { accessToken } = data
          dispatch(setCredentials({ accessToken }))
        } catch (error) {
          console.log(error)
        }
      }
    }),
    getOrcidSession: builder.query({
      query: () => '/auth/orcid/confirmation'
    }),
    finalizeOrcid: builder.mutation({
      query: (body) => ({
        url: '/auth/orcid/finalize',
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useGetOrcidSessionQuery,
  useFinalizeOrcidMutation
} = authApiSlice
