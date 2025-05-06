import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import StatsPanel from '../BilboMDStats'
import { useGetStatsQuery } from 'slices/statsApiSlice'

const mockedUseGetStatsQuery = vi.mocked(useGetStatsQuery)

vi.mock('slices/statsApiSlice', async () => {
  const actual = await vi.importActual('slices/statsApiSlice')
  return {
    ...actual,
    useGetStatsQuery: vi.fn()
  }
})

describe('StatsPanel', () => {
  it('shows a loading spinner when loading', () => {
    mockedUseGetStatsQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isFetching: true,
      isSuccess: false,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<StatsPanel />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows an error alert on error', () => {
    mockedUseGetStatsQuery.mockReturnValue({
      data: null,
      error: { message: 'Something went wrong' },
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: true,
      refetch: vi.fn()
    })

    renderWithProviders(<StatsPanel />)
    expect(screen.getByText(/statistics/i)).toBeInTheDocument()
  })

  it('shows a warning if no stats data is available', () => {
    mockedUseGetStatsQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<StatsPanel />)
    expect(
      screen.getByText(/no statistics data available/i)
    ).toBeInTheDocument()
  })

  it('renders statistics correctly', () => {
    mockedUseGetStatsQuery.mockReturnValue({
      data: {
        userCount: 69,
        jobCount: 5,
        totalJobsFromUsers: 42,
        jobTypes: {
          pdb: 20,
          crd: 10
        }
      },
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<StatsPanel />)

    expect(screen.getByText(/users/i)).toBeInTheDocument()
    expect(screen.getByText('69')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('pdb: 20')).toBeInTheDocument()
    expect(screen.getByText('crd: 10')).toBeInTheDocument()
  })
})
