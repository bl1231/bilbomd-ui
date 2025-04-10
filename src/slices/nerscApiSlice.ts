import { createEntityAdapter } from '@reduxjs/toolkit'
import { superfacilityApiSlice } from 'app/api/sfapiSlice'

interface NerscSystemStatus {
  name: string
  full_name: string
  description: string
  system_type: 'compute' | 'filesystem' | 'service' | 'storage'
  notes: string[]
  status: 'active' | 'degraded' | 'unavailable' | 'other'
  updated_at: string
}

interface NerscPlannedOutage {
  name: string
  start_at: string
  end_at: string
  description: string
  notes: string
  status: string
  swo: string
  update_at: string
}

interface ProjectHours {
  cpu_hours_given: number
  cpu_hours_used: number
  gpu_hours_given: number
  gpu_hours_used: number
}

type NerscSystemStatuses = NerscSystemStatus[]
type NerscPlannedOutages = NerscPlannedOutage[]

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
    getNerscOutages: builder.query<NerscPlannedOutages, void>({
      query: () => ({
        url: 'outages',
        method: 'GET'
      }),
      providesTags: ['Outages']
    }),
    getProjectHours: builder.query<ProjectHours, string>({
      query: (projectCode) => ({
        url: `account/projects/${projectCode}`,
        method: 'GET'
      }),
      providesTags: ['Project']
    })
  })
})

export const {
  useGetNerscStatusQuery,
  useGetNerscOutagesQuery,
  useGetProjectHoursQuery
} = nerscApiSlice
