// import { createEntityAdapter } from '@reduxjs/toolkit'
// import { UseQueryState } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
// import type { RootState } from '../../app/store'

export type User = {
  id: string
  _id: string
  UUID: string
  active: boolean
  createdAt: string
  email: string
  status: string
  updatedAt: string
  username: string
  roles: string[]
}

const usersAdapter = createEntityAdapter<User>({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      transformResponse: (responseData: { success: boolean; data: User[] }) => {
        // Access the `data` field from the response
        const loadedUsers = responseData.data.map((user) => {
          user.id = user._id // Assign 'id' for each user
          return user
        })
        usersAdapter.setAll(initialState, loadedUsers)
        return loadedUsers
      },
      transformErrorResponse: (response: { status: string | number }) => {
        return response.status
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' }
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
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
    })
  })
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select({})

// creates memoized selector
// const selectUsersData = createSelector(
//   selectUsersResult,
//   (usersResult) => usersResult.data // normalized state object with ids & entities
// )

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllUsers,
//   selectById: selectUserById,
//   selectIds: selectUserIds
//   // Pass in a selector that returns the users slice of state
// } = usersAdapter.getSelectors(
//   (state: RootState) => selectUsersData(state) ?? initialState
// )
