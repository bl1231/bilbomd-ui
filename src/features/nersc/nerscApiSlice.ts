import { createEntityAdapter } from '@reduxjs/toolkit'
import { superfacilityApiSlice } from '../../app/api/sfapiSlice'

interface NerscSystemStatus {
  name: string
  full_name: string
  description: string
  system_type: 'compute' | 'filesystem' | 'service' | 'storage'
  notes: string[]
  status: 'active' | 'degraded' | 'unavailable' | 'other'
  updated_at: string
}

interface ProjectHours {
  hours_given: number
  hours_used: number
}

type NerscSystemStatuses = NerscSystemStatus[]

const nerscAdapter = createEntityAdapter({})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState = nerscAdapter.getInitialState()

export const nerscApiSlice = superfacilityApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNerscStatus: builder.query<NerscSystemStatuses, void>({
      query: () => ({
        url: 'status',
        method: 'GET'
      }),
      providesTags: ['Status']
    }),
    getProjectHours: builder.query<ProjectHours, void>({
      query: (projectCode) => ({
        url: `account/projects/${projectCode}`,
        method: 'GET'
      }),
      providesTags: ['Project']
    })
  })
})

export const { useGetNerscStatusQuery, useGetProjectHoursQuery } = nerscApiSlice