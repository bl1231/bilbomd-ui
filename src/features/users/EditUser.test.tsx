import { renderWithProviders } from 'test/test-utils'
import { describe, it, expect, vi } from 'vitest'
import EditUser from './EditUser'
import * as usersApiSlice from 'slices/usersApiSlice'
import * as reactRouterDom from 'react-router-dom'
import { screen } from '@testing-library/react'
// import EditUserForm from './EditUserForm'
// import PulseLoader from 'react-spinners/PulseLoader'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn()
  }
})

vi.mock('slices/usersApiSlice', () => ({
  useGetUsersQuery: vi.fn()
}))

vi.mock('./EditUserForm', () => ({
  __esModule: true,
  default: vi.fn(({ user }) => <div>EditUserForm for {user.name}</div>)
}))

vi.mock('react-spinners/PulseLoader', () => ({
  __esModule: true,
  default: vi.fn(() => <div>Loading...</div>)
}))

describe('EditUser Component', () => {
  it('displays the loading spinner when no user is found', () => {
    vi.mocked(reactRouterDom.useParams).mockReturnValue({ id: '1' })
    vi.mocked(usersApiSlice.useGetUsersQuery).mockReturnValue({
      user: null,
      refetch: vi.fn()
    })

    renderWithProviders(<EditUser />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the EditUserForm when the user is found', () => {
    vi.mocked(reactRouterDom.useParams).mockReturnValue({ id: '1' })
    vi.mocked(usersApiSlice.useGetUsersQuery).mockReturnValue({
      user: { id: '1', name: 'John Doe' },
      refetch: vi.fn()
    })

    renderWithProviders(<EditUser />)

    expect(screen.getByText('EditUserForm for John Doe')).toBeInTheDocument()
  })

  it('updates the document title to "BilboMD: Edit User"', () => {
    vi.mocked(reactRouterDom.useParams).mockReturnValue({ id: '1' })
    vi.mocked(usersApiSlice.useGetUsersQuery).mockReturnValue({
      user: null,
      refetch: vi.fn()
    })

    renderWithProviders(<EditUser />)

    expect(document.title).toBe('BilboMD: Edit User')
  })
})
