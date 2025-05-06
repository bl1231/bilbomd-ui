import { renderWithProviders } from 'test/test-utils'
import { screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useGetUsersQuery } from 'slices/usersApiSlice'
import UsersList from '../UsersList'
const mockUsers = [
  {
    id: '1',
    username: 'John Doe',
    email: 'john@example.com',
    roles: ['User'],
    active: true
  },
  {
    id: '2',
    username: 'Jane Smith',
    email: 'jane@example.com',
    roles: ['Admin'],
    active: false
  }
]
// const stableSelectAllUsers = () => mockUsers
vi.mock('slices/usersApiSlice', () => {
  return {
    useGetUsersQuery: vi.fn(),
    selectAllUsers: vi.fn().mockReturnValue(() => mockUsers)
  }
})

describe('UsersList Component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays loading indicator when data is loading', () => {
    vi.mocked(useGetUsersQuery).mockReturnValue({
      data: null,
      isLoading: true,
      isSuccess: false,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<UsersList />)

    // Check for CircularProgress component
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays an error message when there is an error', () => {
    vi.mocked(useGetUsersQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: true,
      refetch: vi.fn()
    })

    renderWithProviders(<UsersList />)

    // Check for Alert component with error message
    expect(
      screen.getByText(/an error occurred while fetching users/i)
    ).toBeInTheDocument()
  })

  it('displays a warning when data is invalid or missing', () => {
    vi.mocked(useGetUsersQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<UsersList />)

    // Check for warning message
    expect(
      screen.getByText(/no users available or data format is invalid/i)
    ).toBeInTheDocument()
  })

  // it('displays users data in a table when data is successfully fetched', () => {
  //   vi.mocked(useGetUsersQuery).mockReturnValue({
  //     data: mockUsers,
  //     isLoading: false,
  //     isSuccess: true,
  //     isError: false,
  //     error: null,
  //     refetch: vi.fn()
  //   })

  //   renderWithProviders(<UsersList />)

  //   // Check for each user's data in the DataGrid rows
  //   const rows = screen.getAllByRole('row') // Target rows in the table/grid
  //   expect(rows).toHaveLength(3) // Includes header row and 2 data rows

  //   // Check the first user's data
  //   expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
  //   expect(screen.getByText(/john@example.com/i)).toBeInTheDocument()

  //   // Use query specific to grid cells for roles to avoid ambiguity
  //   const roleCells = screen.getAllByRole('gridcell', { name: /User/i })
  //   expect(roleCells).toHaveLength(1) // Ensure only one role cell contains 'User'

  //   // Check the second user's data
  //   expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument()
  //   expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument()

  //   const adminCells = screen.getAllByRole('gridcell', { name: /Admin/i })
  //   expect(adminCells).toHaveLength(1) // Ensure only one role cell contains 'Admin'
  // })
})
