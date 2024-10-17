import { renderWithProviders } from 'test/test-utils'
import { screen, act, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Welcome from './Welcome'
import useAuth from 'hooks/useAuth'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

vi.mock('hooks/useAuth', () => ({
  default: vi.fn()
}))

vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))

vi.mock('slices/nerscApiSlice', () => ({
  useGetNerscStatusQuery: () => ({
    data: [
      {
        name: 'perlmutter',
        full_name: 'Perlmutter',
        description: 'System is active',
        system_type: 'compute',
        notes: [],
        status: 'active',
        updated_at: '2024-10-03T15:35:00-07:00'
      },
      {
        name: 'community_filesystem',
        full_name: 'Community File System (CFS)',
        description: 'System is active',
        system_type: 'filesystem',
        notes: [],
        status: 'active',
        updated_at: '2024-08-06T17:15:00-07:00'
      },
      {
        name: 'spin',
        full_name: 'Spin',
        description: 'System is active',
        system_type: 'service',
        notes: [],
        status: 'active',
        updated_at: '2024-10-04T14:17:00-07:00'
      },
      {
        name: 'ldap',
        full_name: 'LDAP',
        description: 'System is active',
        system_type: 'service',
        notes: [],
        status: 'active',
        updated_at: '2023-08-31T10:45:00-07:00'
      },
      {
        name: 'iris',
        full_name: 'IRIS',
        description: 'System is active',
        system_type: 'service',
        notes: [],
        status: 'active',
        updated_at: '2024-09-04T12:58:00-07:00'
      }
    ],
    isLoading: false,
    error: null,
    isSuccess: true
  })
}))

describe('Welcome Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays loading message while fetching config', () => {
    vi.mocked(useAuth).mockReturnValue({
      username: 'testuser',
      roles: [],
      status: 'active',
      isManager: false,
      isAdmin: false,
      email: 'testuser@example.com'
    })
    vi.mocked(useGetConfigsQuery).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      refetch: vi.fn()
    })

    renderWithProviders(<Welcome />)

    expect(screen.getByText(/Welcome testuser!/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Loading system configuration/i)
    ).toBeInTheDocument()
  })

  it('displays error message when config fails to load', () => {
    vi.mocked(useAuth).mockReturnValue({
      username: 'testuser',
      roles: [],
      status: 'active',
      isManager: false,
      isAdmin: false,
      email: 'testuser@example.com'
    })
    vi.mocked(useGetConfigsQuery).mockReturnValue({
      data: undefined,
      error: true,
      isLoading: false,
      refetch: vi.fn()
    })

    renderWithProviders(<Welcome />)

    expect(
      screen.getByText(/Failed to load system configuration/i)
    ).toBeInTheDocument()
  })

  it('displays Beamline 12.3.1 when not using NERSC', () => {
    vi.mocked(useAuth).mockReturnValue({
      username: 'testuser',
      roles: [],
      status: 'active',
      isManager: false,
      isAdmin: false,
      email: 'testuser@example.com'
    })
    vi.mocked(useGetConfigsQuery).mockReturnValue({
      data: { mode: 'production', useNersc: 'false' },
      error: null,
      isLoading: false,
      refetch: vi.fn()
    })

    renderWithProviders(<Welcome />)

    expect(
      screen.getByText((content, element) => {
        const hasText = (text: string) => content.includes(text)
        const isCorrectElement = element?.tagName.toLowerCase() === 'p'
        return (
          hasText('BilboMD is running in') &&
          hasText('mode') &&
          isCorrectElement
        )
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/Beamline 12.3.1/i)).toBeInTheDocument()
  })

  it('displays NERSC status when using NERSC', async () => {
    vi.mocked(useAuth).mockReturnValue({
      username: 'testuser',
      roles: [],
      status: 'active',
      isManager: false,
      isAdmin: false,
      email: 'testuser@example.com'
    })
    vi.mocked(useGetConfigsQuery).mockReturnValue({
      data: { mode: 'production', useNersc: 'true' },
      error: null,
      isLoading: false,
      refetch: vi.fn()
    })

    await act(async () => {
      renderWithProviders(<Welcome />)
    })

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          const hasText = (text: string) => content.includes(text)
          const isCorrectElement = element?.tagName.toLowerCase() === 'p'
          return (
            hasText('BilboMD is running in') &&
            hasText('mode') &&
            isCorrectElement
          )
        })
      ).toBeInTheDocument()
      expect(screen.getByText(/NERSC/i)).toBeInTheDocument()
      expect(screen.getByText(/perlmutter/i)).toBeInTheDocument()
      expect(screen.getByText(/spin/i)).toBeInTheDocument()
      // screen.debug()
    })
  })

  it('displays contact information', () => {
    vi.mocked(useAuth).mockReturnValue({
      username: 'testuser',
      roles: [],
      status: 'active',
      isManager: false,
      isAdmin: false,
      email: 'testuser@example.com'
    })
    vi.mocked(useGetConfigsQuery).mockReturnValue({
      data: { mode: 'production', useNersc: 'false' },
      error: null,
      isLoading: false,
      refetch: vi.fn()
    })

    renderWithProviders(<Welcome />)

    expect(screen.getByText(/Web implementation/i)).toBeInTheDocument()
    expect(screen.getByText(/Scott Classen/i)).toBeInTheDocument()
    expect(screen.getByText(/Michal Hammel/i)).toBeInTheDocument()
  })
})
