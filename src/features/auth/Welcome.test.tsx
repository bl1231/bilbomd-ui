import { renderWithProviders } from 'test/test-utils'
import { screen, act } from '@testing-library/react'
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
    vi.mock('slices/nerscApiSlice', () => ({
      useGetNerscStatusQuery: () => ({
        data: { status: 'OK' },
        isLoading: false,
        error: null
      })
    }))

    await act(async () => {
      renderWithProviders(<Welcome />)
    })

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

    // This assumes NerscSystemStatuses renders something specific, adjust this accordingly
    // await waitFor(() => {
    //   expect(screen.getByText(/NERSC System Statuses/i)).toBeInTheDocument()
    // })
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
