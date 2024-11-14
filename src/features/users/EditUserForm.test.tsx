// EditUserForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EditUserForm from './EditUserForm'
import { MemoryRouter } from 'react-router-dom'
import {
  useUpdateUserMutation,
  useDeleteUserMutation
} from 'slices/usersApiSlice'

// Mocking the hooks and components used in EditUserForm
vi.mock('slices/usersApiSlice', () => ({
  useUpdateUserMutation: vi.fn(() => [vi.fn(), {}]),
  useDeleteUserMutation: vi.fn(() => [vi.fn(), {}])
}))

vi.mock('slices/jobsApiSlice', () => ({
  useGetJobsQuery: vi.fn(() => ({ data: [] }))
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
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

  it('renders the form with initial values', () => {
    render(
      <MemoryRouter>
        <EditUserForm user={user} />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/username/i)).toHaveValue(user.username)
    expect(screen.getByLabelText(/email/i)).toHaveValue(user.email)
    expect(screen.getByLabelText(/active/i)).toBeChecked()
  })

  it('opens delete confirmation dialog on delete button click', () => {
    render(
      <MemoryRouter>
        <EditUserForm user={user} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText(`Delete ${user.username}`))
    expect(screen.getByText(`Delete ${user.username} ?`)).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const updateUserMock = vi.fn()

    // Adjust the mock to return the mocked function
    vi.mocked(useUpdateUserMutation).mockReturnValue([
      updateUserMock,
      { reset: vi.fn() }
    ])

    render(
      <MemoryRouter>
        <EditUserForm user={user} />
      </MemoryRouter>
    )

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

    // Adjust the mock to return the mocked function
    vi.mocked(useDeleteUserMutation).mockReturnValue([
      deleteUserMock,
      { reset: vi.fn() }
    ])

    render(
      <MemoryRouter>
        <EditUserForm user={user} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText(`Delete ${user.username}`))

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith({ id: user.id })
    })
  })
})
