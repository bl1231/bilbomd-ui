import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './reducers/apiSlice';
import authReducer from './reducers/authSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer
  },
  // middleware needed for RTK to cache results...n stuff
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // for development
  devTools: true
});
