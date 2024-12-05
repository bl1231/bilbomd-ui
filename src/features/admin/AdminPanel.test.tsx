import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, Mock } from 'vitest'
import AdminPanel from './AdminPanel'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))

describe('AdminPanel Component', () => {
  it('should display CircularProgress when loading', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({ isLoading: true })
    render(<AdminPanel />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should display error Alert when there is an error', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({
      error: 'Error occurred'
    })
    render(<AdminPanel />)
    expect(
      screen.getByText(/Error loading configuration data/i)
    ).toBeInTheDocument()
  })

  it('should display warning Alert when no config data', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({ data: null })
    render(<AdminPanel />)
    expect(
      screen.getByText(/No configuration data available/i)
    ).toBeInTheDocument()
  })

  it('should render data correctly when available', () => {
    const mockData = { key1: 'value1', key2: 'value2' }
    ;(useGetConfigsQuery as Mock).mockReturnValue({ data: mockData })
    render(<AdminPanel />)
    expect(screen.getByText(/Admin Panel - Config/i)).toBeInTheDocument()
    expect(screen.getByText(/key1/i)).toBeInTheDocument()
    expect(screen.getByText(/value1/i)).toBeInTheDocument()
    expect(screen.getByText(/key2/i)).toBeInTheDocument()
    expect(screen.getByText(/value2/i)).toBeInTheDocument()
  })
})
