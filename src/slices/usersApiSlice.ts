import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
import { IUser } from '@bl1231/bilbomd-mongodb-schema'

type NormalizedUser = IUser & { id: string }

const usersAdapter = createEntityAdapter<NormalizedUser>()

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      transformResponse: (responseData: {
        success: boolean
        data: IUser[]
      }) => {
        const loadedUsers = responseData.data.map((user) => ({
          ...(user as IUser),
          id: user._id.toString()
        })) as NormalizedUser[]
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      transformErrorResponse: (response: { status: string | number }) => {
        return response.status
      },
      providesTags: (result) =>
        result?.ids
          ? [
              { type: 'User', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'User' as const, id }))
            ]
          : [{ type: 'User', id: 'LIST' }]
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...initialUserData
        }
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users',
        method: 'PATCH',
        body: {
          ...initialUserData
        }
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'User', id: arg.id }]
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'User', id: arg.id }]
    }),
    getAPITokens: builder.query({
      query: (username: string) => ({
        url: `/users/${username}/tokens`,
        method: 'GET'
      }),
      providesTags: (_result, _error, username) => [
        { type: 'Token', id: username }
      ]
    }),
    createAPIToken: builder.mutation({
      query: ({ username, label, expiresAt }) => ({
        url: `/users/${username}/tokens`,
        method: 'POST',
        body: { label, expiresAt }
      }),
      invalidatesTags: (_result, _error, { username }) => [
        { type: 'Token', id: username }
      ]
    }),
    deleteAPIToken: builder.mutation({
      query: ({ username, id }) => ({
        url: `/users/${username}/tokens/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, { username }) => [
        { type: 'Token', id: username }
      ]
    })
  })
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAPITokensQuery,
  useCreateAPITokenMutation,
  useDeleteAPITokenMutation
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select({})

import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data ?? initialState
)

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors<RootState>((state) => selectUsersData(state))
