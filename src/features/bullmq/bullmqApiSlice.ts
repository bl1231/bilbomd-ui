import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from 'app/api/apiSlice'

const bullmqAdapter = createEntityAdapter({})

export const initialState = bullmqAdapter.getInitialState()

export const bullmqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQueueState: builder.query({
      query: () => ({
        url: '/bullmq',
        method: 'GET'
      })
    })
  })
})

export const { useGetQueueStateQuery } = bullmqApiSlice
