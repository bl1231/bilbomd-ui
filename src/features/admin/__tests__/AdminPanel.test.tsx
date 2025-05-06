import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import AdminPanel from '../AdminPanel'

vi.mock('slices/adminApiSlice', async () => {
  const actual = await vi.importActual('slices/adminApiSlice')
  return {
    ...actual,
    useGetQueuesQuery: vi.fn(() => ({
      data: [
        {
          name: 'bilbomd',
          jobCounts: {
            active: 1,
            completed: 5,
            delayed: 0,
            failed: 0,
            paused: 0,
            prioritized: 0,
            waiting: 2,
            'waiting-children': 0
          },
          isPaused: false
        }
      ],
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn()
    }))
  }
})

vi.mock('slices/statsApiSlice', async () => {
  const actual = await vi.importActual('slices/statsApiSlice')
  return {
    ...actual,
    useGetStatsQuery: vi.fn(() => ({
      data: {
        userCount: 1,
        jobCount: 2,
        totalJobsFromUsers: 3,
        jobTypes: { pdb: 1, crd: 1 }
      },
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn()
    }))
  }
})

vi.mock('slices/configsApiSlice', async () => {
  const actual = await vi.importActual('slices/configsApiSlice')
  return {
    ...actual,
    useGetConfigsQuery: vi.fn(() => ({
      data: {
        tokenExpires: 900,
        useNersc: true,
        nerscProject: 'ABC123'
      },
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn()
    }))
  }
})

describe('AdminPanel', () => {
  it('renders without crashing and shows section headings', () => {
    renderWithProviders(<AdminPanel />)

    expect(screen.getByText(/BullMQ Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/BilboMD Job Statistics/i)).toBeInTheDocument()
    // expect(screen.getByText(/configuration/i)).toBeInTheDocument()
  })
})
