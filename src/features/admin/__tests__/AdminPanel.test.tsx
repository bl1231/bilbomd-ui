import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, Mock } from 'vitest'
import AdminPanel from '../AdminPanel'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useGetStatsQuery } from 'slices/statsApiSlice'

vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))

vi.mock('slices/statsApiSlice', () => ({
  useGetStatsQuery: vi.fn()
}))

describe('AdminPanel Component', () => {
  it('should display CircularProgress when loading', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({ isLoading: true })
    ;(useGetStatsQuery as Mock).mockReturnValue({ isLoading: true })
    render(<AdminPanel />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should display error Alert when there is an error', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({ error: 'Error occurred' })
    ;(useGetStatsQuery as Mock).mockReturnValue({ data: {}, isLoading: false }) // valid fallback
    render(<AdminPanel />)
    expect(screen.getByText(/Error loading data/i)).toBeInTheDocument()
  })

  it('should display warning Alert when no config data', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({ data: null })
    ;(useGetStatsQuery as Mock).mockReturnValue({ data: {}, isLoading: false }) // fallback stats
    render(<AdminPanel />)
    expect(
      screen.getByText(/No configuration data available/i)
    ).toBeInTheDocument()
  })

  it('should display warning Alert when no stats data', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({
      data: {},
      isLoading: false
    }) // fallback config
    ;(useGetStatsQuery as Mock).mockReturnValue({ data: null })
    render(<AdminPanel />)
    expect(
      screen.getByText(/No statistics data available/i)
    ).toBeInTheDocument()
  })

  it('should render data correctly when available', () => {
    const mockConfig = { key1: 'value1', key2: 'value2' }
    const mockStats = {
      userCount: 1,
      jobCount: 13,
      totalJobsFromUsers: 31,
      jobTypes: {
        alphafold: 8,
        auto: 11,
        crd_psf: 2,
        pdb: 10
      }
    }

    ;(useGetConfigsQuery as Mock).mockReturnValue({
      data: mockConfig,
      isLoading: false
    })
    ;(useGetStatsQuery as Mock).mockReturnValue({
      data: mockStats,
      isLoading: false
    })

    render(<AdminPanel />)

    expect(screen.getByText(/Admin Panel - Stats/i)).toBeInTheDocument()
    expect(screen.getByText(/Admin Panel - Configuration/i)).toBeInTheDocument()
    expect(screen.getByText(/key1/i)).toBeInTheDocument()
    expect(screen.getByText(/value1/i)).toBeInTheDocument()
    expect(screen.getByText(/key2/i)).toBeInTheDocument()
    expect(screen.getByText(/value2/i)).toBeInTheDocument()
    expect(screen.getByText(/ALPHAFOLD/i)).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })
})
