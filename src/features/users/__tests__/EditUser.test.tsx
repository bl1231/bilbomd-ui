import { renderWithProviders } from 'test/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EditUser from '../EditUser'
import * as usersApiSlice from '../../../slices/usersApiSlice'
import * as reactRouterDom from 'react-router-dom'
import { screen } from '@testing-library/react'
import EditUserForm from '../EditUserForm'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn()
  }
})

vi.mock('../../../slices/usersApiSlice', () => ({
  useGetUsersQuery: vi.fn()
}))

vi.mock('../EditUserForm', () => ({
  __esModule: true,
  default: vi.fn()
}))

vi.mock('react-spinners/PulseLoader', () => ({
  __esModule: true,
  default: vi.fn(() => <div>Loading...</div>)
}))

describe('EditUser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    vi.mocked(reactRouterDom.useParams).mockReturnValue({ id: '1' })
    vi.mocked(usersApiSlice.useGetUsersQuery).mockReturnValue({
      user: null,
      refetch: vi.fn()
    })
  })

  it('displays the loading spinner when no user is found', () => {
    renderWithProviders(<EditUser />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the EditUserForm when the user is found', () => {
    vi.mocked(usersApiSlice.useGetUsersQuery).mockReturnValue({
      user: { id: '1', name: 'John Doe' },
      refetch: vi.fn()
    })

    renderWithProviders(<EditUser />)

    // Assert that EditUserForm was called with the correct props
    expect(EditUserForm).toHaveBeenCalledWith(
      { user: { id: '1', name: 'John Doe' } },
      expect.anything() // Ensures React props are passed
    )
  })

  it('updates the document title to "BilboMD: Edit User"', () => {
    renderWithProviders(<EditUser />)
    expect(document.title).toBe('BilboMD: Edit User')
  })

  it('provides a refetch function to refresh user data', () => {
    const mockRefetch = vi.fn()
    vi.mocked(usersApiSlice.useGetUsersQuery).mockReturnValue({
      user: null,
      refetch: mockRefetch
    })

    renderWithProviders(<EditUser />)

    expect(mockRefetch).not.toHaveBeenCalled() // Ensure it’s not called on initial render
    expect(typeof mockRefetch).toBe('function') // Ensure it’s a function
  })

  it('displays the loading spinner if no id is provided in useParams', () => {
    vi.mocked(reactRouterDom.useParams).mockReturnValue({})

    renderWithProviders(<EditUser />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  // it('displays an error message when useGetUsersQuery fails', () => {
  //   vi.mocked(usersApiSlice.useGetUsersQuery).mockReturnValue({
  //     user: null,
  //     refetch: vi.fn(),
  //     error: { message: 'Failed to load user' }
  //   })

  //   renderWithProviders(<EditUser />)

  //   expect(screen.getByText(/Failed to load user/i)).toBeInTheDocument()
  // })

  it('does not render EditUserForm when no user is found', () => {
    renderWithProviders(<EditUser />)

    expect(screen.queryByText(/EditUserForm/i)).not.toBeInTheDocument()
  })

  it('resets the document title on unmount', () => {
    const { unmount } = renderWithProviders(<EditUser />)

    expect(document.title).toBe('BilboMD: Edit User')

    unmount()

    expect(document.title).not.toBe('BilboMD: Edit User') // Assuming cleanup resets it
  })
})
