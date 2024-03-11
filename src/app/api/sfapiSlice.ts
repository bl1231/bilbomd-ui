import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios'

const baseURL = 'https://api.nersc.gov/api/v1.2'
const tokenUrl = 'https://oidc.nersc.gov/c2id/token'

// Token management
let currentToken = null
let tokenPromise = null

// The fetchToken function is responsible for fetching the OAuth2 token from
// the authorization server. It caches the token and sets a timeout to clear
// the token a bit before it expires, based on the expires_in value provided
// by the server.
const fetchToken = async () => {
  const clientId = '<your client id>'
  const clientSecret = '<your client secret>'

  try {
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')

    const { data } = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: clientId,
        password: clientSecret
      }
    })

    currentToken = data.access_token
    setTimeout(() => (currentToken = null), (data.expires_in - 60) * 1000) // Refresh token before it expires
    return data.access_token
  } catch (error) {
    console.error('Error fetching token:', error)
    throw error
  }
}
// The getToken function checks if a token is currently available or being fetched.
// It returns the current token if available, initiates a token fetch if not,
//and ensures subsequent calls wait for the ongoing fetch if it's already in progress.
const getToken = () => {
  if (!currentToken && !tokenPromise) {
    tokenPromise = fetchToken().finally(() => (tokenPromise = null))
  }
  return tokenPromise || Promise.resolve(currentToken)
}

// RTK Query's baseQuery with OAuth2 token
const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: async (headers) => {
    const token = await getToken()
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

// initialize an empty API service that we'll inject endpoints into later as needed
export const superfacilityApiSlice = createApi({
  reducerPath: 'superfacilityApi',
  baseQuery: baseQuery,
  tagTypes: ['Status'],
  endpoints: () => ({})
})
