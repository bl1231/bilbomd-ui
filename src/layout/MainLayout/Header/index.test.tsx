import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore, Middleware } from '@reduxjs/toolkit'
import Header from './index'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import useAuth from 'hooks/useAuth'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface ConfigData {
  useNersc: string
  mode: string
  deploySite: string
}

interface AuthState {
  username: string
  status: string
  roles: string[]
  isManager: boolean
  isAdmin: boolean
  email: string
}

const mockConfigsApi = {
  reducerPath: 'configsApi',
  reducer: (state = {}) => state,
  middleware: (() => (next: (action: unknown) => void) => (action: unknown) =>
    next(action)) as Middleware
}

const mockAuthReducer = (state = {}): AuthState => state as AuthState

const store = configureStore({
  reducer: {
    auth: mockAuthReducer,
    [mockConfigsApi.reducerPath]: mockConfigsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mockConfigsApi.middleware)
})

const mockNavigate = vi.fn()

vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))

vi.mock('hooks/useAuth', () => ({
  default: vi.fn()
}))

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}))

type ConfigQueryResult = ReturnType<typeof useGetConfigsQuery>

function renderWithProvider(ui: React.ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('Header Component', () => {
  const mockConfig: ConfigData = {
    useNersc: 'true',
    mode: 'development',
    deploySite: 'nersc'
  }

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      username: 'testUser',
      status: 'Active',
      roles: ['User'],
      isManager: false,
      isAdmin: false,
      email: ''
    })

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00'))
    mockNavigate.mockClear()
  })

  it('renders loading state correctly', () => {
    const loadingState: ConfigQueryResult = {
      data: undefined,
      error: undefined,
      isLoading: true,
      isFetching: true,
      isSuccess: false,
      isError: false,
      isUninitialized: false,
      status: 'pending',
      refetch: vi.fn().mockResolvedValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        isSuccess: false,
        isError: false,
        status: 'fulfilled'
      })
    }

    vi.mocked(useGetConfigsQuery).mockReturnValue(loadingState)
    renderWithProvider(<Header />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    const errorState: ConfigQueryResult = {
      data: undefined,
      error: { status: 500, data: 'Test error' } as FetchBaseQueryError,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: true,
      isUninitialized: false,
      status: 'rejected',
      refetch: vi.fn().mockResolvedValue({
        data: undefined,
        error: { status: 500, data: 'Test error' } as FetchBaseQueryError,
        isLoading: false,
        isSuccess: false,
        isError: true,
        status: 'rejected'
      })
    }

    vi.mocked(useGetConfigsQuery).mockReturnValue(errorState)
    renderWithProvider(<Header />)
    expect(
      screen.getByText('Error loading configuration data')
    ).toBeInTheDocument()
  })

  it('renders NERSC configuration correctly', () => {
    const successState: ConfigQueryResult = {
      data: mockConfig,
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      isUninitialized: false,
      status: 'fulfilled',
      refetch: vi.fn().mockResolvedValue({
        data: mockConfig,
        error: undefined,
        isLoading: false,
        isSuccess: true,
        isError: false,
        status: 'fulfilled'
      })
    }

    vi.mocked(useGetConfigsQuery).mockReturnValue(successState)
    renderWithProvider(<Header />)
    expect(screen.getByText('BilboMD')).toBeInTheDocument()
    expect(screen.getByText('DEVELOPMENT')).toBeInTheDocument()
    expect(screen.getByAltText('NERSC Logo')).toBeInTheDocument()
    expect(screen.getByText(/testUser/)).toBeInTheDocument()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })
})
