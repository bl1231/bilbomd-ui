import { renderWithProviders } from 'test/test-utils'
import { screen, waitFor, act } from '@testing-library/react'
import Home from '../Home'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
import { useRefreshMutation } from 'slices/authApiSlice'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useNavigate } from 'react-router-dom'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(), // Mock the navigation function
    MemoryRouter: actual.MemoryRouter // Ensure MemoryRouter is returned
  }
})

// Mock usePersist hook
vi.mock('../../hooks/usePersist', () => ({
  default: vi.fn(() => [true, vi.fn()]) // Mock usePersist with persist enabled
}))

// Partial mock for react-redux to only mock useSelector
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...actual,
    useSelector: vi.fn() // Mock useSelector
  }
})

// Mock the authApiSlice useRefreshMutation
vi.mock('slices/authApiSlice', () => ({
  useRefreshMutation: vi.fn(() => [
    vi.fn(), // Mock the refresh function
    {
      isUninitialized: true,
      isLoading: false,
      isSuccess: false,
      reset: vi.fn()
    }
  ])
}))

vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders welcome message for unauthenticated users (no token)', async () => {
    // Mock useSelector to return null (unauthenticated state)
    vi.mocked(useSelector).mockImplementation((selector) => {
      if (selector === selectCurrentToken) {
        return null // Simulate no token (unauthenticated)
      }
    })
    vi.mocked(useGetConfigsQuery).mockReturnValue({
      data: { mode: 'production', useNersc: 'false' },
      error: null,
      isLoading: false,
      refetch: vi.fn()
    })
    await act(async () => {
      renderWithProviders(<Home />)
    })
    // Assert the welcome message is displayed for unauthenticated users
    expect(screen.getByText(/Welcome to BilboMD/i)).toBeInTheDocument()
  })

  it('shows loading spinner when refresh token is in progress', async () => {
    // Mock useSelector to return null (unauthenticated state)
    vi.mocked(useSelector).mockImplementation((selector) => {
      if (selector === selectCurrentToken) {
        return null // Simulate no token (unauthenticated)
      }
    })

    // Mock useRefreshMutation to return loading state
    vi.mocked(useRefreshMutation).mockReturnValue([
      vi.fn(), // Simulate refresh function
      { isLoading: true, isSuccess: false, reset: vi.fn() } // Simulate loading state
    ])

    await act(async () => {
      renderWithProviders(<Home />)
    })

    // Assert the loading spinner is shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('navigates to welcome page on successful refresh', async () => {
    const mockNavigate = vi.fn()

    // Mock useSelector to return null (unauthenticated state)
    vi.mocked(useSelector).mockImplementation((selector) => {
      if (selector === selectCurrentToken) {
        return null // Simulate no token (unauthenticated)
      }
    })

    // Mock useRefreshMutation to return success state
    vi.mocked(useRefreshMutation).mockReturnValue([
      vi.fn().mockResolvedValueOnce({}), // Simulate successful refresh
      { isSuccess: true, isLoading: false, reset: vi.fn() }
    ])

    // Mock the useNavigate function to test navigation
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    renderWithProviders(<Home />)

    // Wait for the effect to trigger and simulate successful refresh
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('welcome')
    })
  })
})
