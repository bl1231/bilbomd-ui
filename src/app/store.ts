import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { superfacilityApiSlice } from './api/sfapiSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../slices/authSlice'

export const store = configureStore({
  reducer: {
    // Existing apiSlice for bilbomd-backend
    [apiSlice.reducerPath]: apiSlice.reducer,
    // NERSC superfacilityApiSlice.reducer
    [superfacilityApiSlice.reducerPath]: superfacilityApiSlice.reducer,
    // Auth reducer
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      superfacilityApiSlice.middleware
    ),
  // for development
  devTools: true
})

setupListeners(store.dispatch)

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
