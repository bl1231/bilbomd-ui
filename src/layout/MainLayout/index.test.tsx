import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, Mock } from 'vitest'
import ClippedDrawer from './index'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import useAuth from 'hooks/useAuth'
import { Router } from 'react-router'

vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))

vi.mock('hooks/useAuth', () => ({
  default: vi.fn()
}))

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as object
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(() => ({ pathname: '/dashboard/jobs' }))
  }
})

describe('ClippedDrawer Component', () => {
  const useGetConfigsQueryMock = useGetConfigsQuery as unknown as Mock
  const useAuthMock = useAuth as unknown as Mock

  function renderWithRouter(
    ui: React.ReactNode,
    initialPath = '/dashboard/jobs'
  ) {
    const location = {
      pathname: initialPath,
      search: '',
      hash: '',
      state: null,
      key: 'default'
    }

    // Minimal mock navigator with just the methods react-router expects
    const navigator = {
      createHref: vi.fn(),
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn()
    }

    return {
      ...render(
        <Router location={location} navigator={navigator}>
          {ui}
        </Router>
      ),
      navigator
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading spinner when data is loading', () => {
    useGetConfigsQueryMock.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isFetching: false,
      isSuccess: false,
      isError: false,
      isUninitialized: false,
      status: 'pending',
      refetch: vi.fn()
    })

    useAuthMock.mockReturnValue({ isAdmin: false })

    renderWithRouter(<ClippedDrawer />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders error alert when there is a config error', () => {
    useGetConfigsQueryMock.mockReturnValue({
      data: null,
      error: true,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: true,
      isUninitialized: false,
      status: 'rejected',
      refetch: vi.fn()
    })

    useAuthMock.mockReturnValue({ isAdmin: false })

    renderWithRouter(<ClippedDrawer />)

    expect(
      screen.getByText(/Error loading configuration data/i)
    ).toBeInTheDocument()
  })
})
