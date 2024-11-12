// UsersList.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useGetUsersQuery } from 'slices/usersApiSlice'
import UsersList from './UsersList'

// Mock the useGetUsersQuery hook
vi.mock('slices/usersApiSlice', () => ({
  useGetUsersQuery: vi.fn()
}))

describe('UsersList Component', () => {
  it('should display loading indicator when data is loading', () => {
    ;(useGetUsersQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null
    })

    render(
      <MemoryRouter>
        <UsersList />
      </MemoryRouter>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should display an error message when there is an error', () => {
    ;(useGetUsersQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error('Failed to fetch')
    })

    render(
      <MemoryRouter>
        <UsersList />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/an error occurred while fetching users/i)
    ).toBeInTheDocument()
  })

  it('should display users data in a table when data is successfully fetched', () => {
    const mockUsers = [
      {
        id: '1',
        username: 'shreyastest',
        email: 'john@example.com',
        roles: ['user'],
        active: true
      }
    ]

    ;(useGetUsersQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null
    })

    render(
      <MemoryRouter>
        <UsersList />
      </MemoryRouter>
    )

    expect(screen.getByText(/shreyastest/i)).toBeInTheDocument()
  })
})
