import { createEntityAdapter } from '@reduxjs/toolkit'
import { UseQueryState } from '@reduxjs/toolkit/dist/query/react/buildHooks'
// import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
// import type { RootState } from '../../app/store'

type User = 
  [key: 'string' | number]: string | number | string[] | boolean

// type UsersResponse = User[]

const usersAdapter = createEntityAdapter({})

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
      transformResponse: (response: User[]) => {
        const loadedUsers = response.map((user) => {
          user.id = user._id
          console.log(user)
          return user
        })
        usersAdapter.setAll(initialState, loadedUsers)
        return loadedUsers
      },
      transformErrorResponse: (response: { status: string | number }) => {
        return response.status
      },
      providesTags: (result, error, arg) => {
        console.log('result: ', result)
        if (result) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids<number>.map((id) => ({ type: 'User', id }))
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      }
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
        url: `/users`,
        method: 'DELETE',
        body: { id }
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
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select(0)

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
