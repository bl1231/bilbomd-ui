import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseURL = 'https://api.nersc.gov/api/v1.2'

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: 'include'
})

// Assume you have a function to get an OAuth token
// This is just a placeholder. You'll need to implement the actual logic based on the OAuth flow used by the API.
// async function getOAuthToken() {
//     // Implement token retrieval logic
// }

// const baseQueryWithAuth = async (args, api, extraOptions) => {
//     const token = await getOAuthToken();
//     // Clone the args to avoid "TypeError: Cannot assign to read only property"
//     let modifiedArgs = { ...args };
//     if (typeof modifiedArgs.headers === 'undefined') {
//         modifiedArgs.headers = {};
//     }
//     modifiedArgs.headers['Authorization'] = `Bearer ${token}`;

//     return baseQuery(modifiedArgs, api, extraOptions);
// };

// initialize an empty api service that we'll inject endpoints into later as needed
export const superfacilityApiSlice = createApi({
  reducerPath: 'superfacilityApi',
  baseQuery: baseQuery,
  tagTypes: ['Status'],
  endpoints: () => ({})
})
