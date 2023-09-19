import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'
// import { Queue } from 'types/interfaces'
const bullmqAdapter = createEntityAdapter({})

export const initialState = bullmqAdapter.getInitialState()

export const bullmqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQueueState: builder.query({
      query: () => ({
        url: '/bullmq',
        method: 'GET',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      })
    })
  })
})

export const { useGetQueueStateQuery } = bullmqApiSlice
