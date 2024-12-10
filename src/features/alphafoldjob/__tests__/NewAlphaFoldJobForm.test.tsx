import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, Mock } from 'vitest'
import { vi } from 'vitest'
import NewAlphaFoldJob from '../NewAlphaFoldJobForm'
import { useAddNewAlphaFoldJobMutation } from 'slices/jobsApiSlice'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

// Mock slices and hooks
vi.mock('slices/jobsApiSlice', () => ({
  useAddNewAlphaFoldJobMutation: vi.fn()
}))
vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))
vi.mock('hooks/useAuth', () => ({
  default: vi.fn(() => ({ email: 'test@example.com' }))
}))

vi.mock('react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
}))
describe('NewAlphaFoldJob Component', () => {
  beforeEach(() => {
    // Set up default mocks
    ;(useAddNewAlphaFoldJobMutation as Mock).mockReturnValue([
      vi.fn(),
      { isSuccess: false }
    ])
    ;(useGetConfigsQuery as Mock).mockReturnValue({
      data: { useNersc: 'false' },
      error: null,
      isLoading: false
    })
  })
  it('renders the form correctly', () => {
    render(<NewAlphaFoldJob />)

    // Check for essential fields
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
    expect(screen.getByText(/BilboMD AF Job Form/i)).toBeInTheDocument()
    expect(screen.getByText(/Add Entity/i)).toBeInTheDocument()
  })
  it('handles configuration loading state', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true
    })

    render(<NewAlphaFoldJob />)

    // Check for loading indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('handles configuration error state', () => {
    ;(useGetConfigsQuery as Mock).mockReturnValue({
      data: null,
      error: new Error('Error loading configuration'),
      isLoading: false
    })

    render(<NewAlphaFoldJob />)

    // Check for error message
    expect(screen.getByText(/Error loading configuration/i)).toBeInTheDocument()
  })
})
