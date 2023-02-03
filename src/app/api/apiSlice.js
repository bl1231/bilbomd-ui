import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// if accessToken has expired but we still have a valid refreshToken
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // 401 Unauthorized will result in logout
  // 403 Forbidden means backend api knows about user but tokens are expired
  if (result?.error?.originalStatus === 403) {
    console.log('sending refresh token');
    // send refreshToken to get new accessToken
    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    console.log(refreshResult);
    if (refreshResult?.data) {
      const user = api.getState().auth.user; // already know our name. not getting from refresh.
      // store the new accessToken
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      // retry the original query with new accessToken
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut()); // probably received a 401
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Job', 'User'],
  endpoints: (builder) => ({})
});
