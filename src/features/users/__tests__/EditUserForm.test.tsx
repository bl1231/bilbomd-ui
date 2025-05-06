import { renderWithProviders } from 'test/test-utils'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import EditUserForm from '../EditUserForm'
import {
  useUpdateUserMutation,
  useDeleteUserMutation
} from 'slices/usersApiSlice'

// Mocking the hooks and components used in EditUserForm.
vi.mock('slices/usersApiSlice', () => ({
  useUpdateUserMutation: vi.fn(() => [vi.fn(), {}]),
  useDeleteUserMutation: vi.fn(() => [vi.fn(), {}])
}))

vi.mock('slices/jobsApiSlice', () => ({
  useGetJobsQuery: vi.fn(() => ({
    data: {
      ids: ['job1'],
      entities: {
        job1: {
          id: 'job1',
          username: 'testuser',
          mongo: {
            _id: 'job1',
            status: 'Completed',
            user: { _id: '1' },
            __t: 'BilboMdPDB',
            time_submitted: new Date().toISOString()
          }
        }
      }
    },
    isSuccess: true
  })),
  useDeleteJobMutation: vi.fn(() => [vi.fn(), {}])
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn())
  }
})

describe('EditUserForm Component', () => {
  const user = {
    _id: '1',
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    active: true,
    roles: ['Admin'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    UUID: '1234-5678'
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form with initial values', () => {
    renderWithProviders(<EditUserForm user={user} />)

    expect(screen.getByLabelText(/username/i)).toHaveValue(user.username)
    expect(screen.getByLabelText(/email/i)).toHaveValue(user.email)
    expect(screen.getByLabelText(/active/i)).toBeChecked()
  })

  it('opens delete confirmation dialog on delete button click', () => {
    renderWithProviders(<EditUserForm user={user} />)

    fireEvent.click(screen.getByText(`Delete ${user.username}`))
    expect(screen.getByText(`Delete ${user.username} ?`)).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const updateUserMock = vi.fn()

    vi.mocked(useUpdateUserMutation).mockReturnValue([
      updateUserMock,
      { reset: vi.fn() }
    ])

    renderWithProviders(<EditUserForm user={user} />)

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newusername' }
    })

    fireEvent.submit(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({
        id: user.id,
        username: 'newusername',
        roles: user.roles,
        active: user.active,
        email: user.email
      })
    })
  })

  it('handles delete user action', async () => {
    const deleteUserMock = vi.fn()

    vi.mocked(useDeleteUserMutation).mockReturnValue([
      deleteUserMock,
      { reset: vi.fn() }
    ])

    renderWithProviders(<EditUserForm user={user} />)

    fireEvent.click(screen.getByText(`Delete ${user.username}`))
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith({ id: user.id })
    })
  })
})
