import { screen, fireEvent, act, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import UserAccount from '../UserAccount'
import { renderWithProviders } from 'test/test-utils'
import * as useAuthModule from 'hooks/useAuth'
import useLogout from 'hooks/useLogout'
import * as userAccountApiSlice from '../../../slices/userAccountApiSlice'

// Mock the hooks and API mutations
vi.mock('hooks/useAuth')
vi.mock('hooks/useLogout')
vi.mock('../../../slices/userAccountApiSlice')

describe('UserAccount Component', () => {
  let mockUpdateEmailMutation: Mock
  let mockVerifyOtpMutation: Mock
  let mockResendOtpMutation: Mock
  let mockDeleteUserByUserNameMutation: Mock

  let mockLogout: Mock

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useAuth to return a test user
    const mockedUseAuth = useAuthModule.default as Mock
    mockedUseAuth.mockReturnValue({
      username: 'testuser',
      email: 'testuser@example.com',
      roles: ['user'],
      status: 'active',
      isManager: false,
      isAdmin: false
    })

    // Mock useLogout
    const mockedUseLogout = useLogout as Mock
    mockLogout = vi.fn()
    mockedUseLogout.mockReturnValue(mockLogout)

    // Mock the API mutations
    mockUpdateEmailMutation = vi.fn()
    mockVerifyOtpMutation = vi.fn()
    mockResendOtpMutation = vi.fn()
    mockDeleteUserByUserNameMutation = vi.fn()

    // Cast hooks to mocked functions
    const mockedUseUpdateEmailMutation =
      userAccountApiSlice.useUpdateEmailMutation as Mock
    const mockedUseVerifyOtpMutation =
      userAccountApiSlice.useVerifyOtpMutation as Mock
    const mockedUseResendOtpMutation =
      userAccountApiSlice.useResendOtpMutation as Mock
    const mockedUseDeleteUserByUserNameMutation =
      userAccountApiSlice.useDeleteUserByUserNameMutation as Mock

    // Mock return values with both trigger and result
    mockedUseUpdateEmailMutation.mockReturnValue([
      mockUpdateEmailMutation,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        reset: vi.fn()
      }
    ] as const)

    mockedUseVerifyOtpMutation.mockReturnValue([
      mockVerifyOtpMutation,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        reset: vi.fn()
      }
    ] as const)

    mockedUseResendOtpMutation.mockReturnValue([
      mockResendOtpMutation,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        reset: vi.fn()
      }
    ] as const)

    mockedUseDeleteUserByUserNameMutation.mockReturnValue([
      mockDeleteUserByUserNameMutation,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        reset: vi.fn()
      }
    ] as const)

    // Mock the unwrap function to resolve promises
    mockUpdateEmailMutation.mockReturnValue({
      unwrap: () => Promise.resolve()
    })
    mockVerifyOtpMutation.mockReturnValue({
      unwrap: () => Promise.resolve()
    })
    mockResendOtpMutation.mockReturnValue({
      unwrap: () => Promise.resolve()
    })
    mockDeleteUserByUserNameMutation.mockReturnValue({
      unwrap: () => Promise.resolve()
    })
  })

  it('renders without crashing', () => {
    const { container } = renderWithProviders(<UserAccount />)
    expect(container).toBeInTheDocument()
  })

  it('displays user information correctly', () => {
    renderWithProviders(<UserAccount />)

    // Get the element containing 'User Name: testuser'
    const userNameElement = screen.getByText((_, element) => {
      return element?.textContent === 'User Name: testuser'
    })
    expect(userNameElement).toBeInTheDocument()

    // Get the element containing 'Email Address: testuser@example.com'
    const emailElement = screen.getByText((_, element) => {
      return element?.textContent === 'Email Address: testuser@example.com'
    })
    expect(emailElement).toBeInTheDocument()

    // Get the element containing 'Roles: user'
    const rolesElement = screen.getByText((_, element) => {
      return element?.textContent === 'Roles: user'
    })
    expect(rolesElement).toBeInTheDocument()
  })

  it('validates email update form', async () => {
    renderWithProviders(<UserAccount />)

    // Click the Update Email button without entering an email
    const updateButton = screen.getByRole('button', { name: /Update Email/i })
    fireEvent.click(updateButton)

    // Expect validation error message
    expect(
      await screen.findByText(/New email address is required/i)
    ).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<UserAccount />)

    // Enter invalid email
    const emailInput = screen.getByLabelText(/New Email Address/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    // Click the Update Email button
    const updateButton = screen.getByRole('button', { name: /Update Email/i })
    fireEvent.click(updateButton)

    // Expect validation error message
    expect(
      await screen.findByText(/Invalid email address/i)
    ).toBeInTheDocument()
  })

  it('shows confirmation dialog when Delete Account is clicked', () => {
    renderWithProviders(<UserAccount />)

    // Click Delete Account button
    const deleteAccountButton = screen.getByRole('button', {
      name: /Delete Account/i
    })
    fireEvent.click(deleteAccountButton)

    // Expect confirmation dialog to be visible
    expect(screen.getByText(/Confirm Account Deletion/i)).toBeInTheDocument()
  })

  it('confirms account deletion and calls deleteUserByUserName mutation', async () => {
    renderWithProviders(<UserAccount />)

    // Click Delete Account button
    const deleteAccountButton = screen.getByRole('button', {
      name: /^Delete Account$/i
    })
    fireEvent.click(deleteAccountButton)

    // Wait for confirmation dialog to appear
    const confirmationDialogTitle = await screen.findByText(
      /Confirm Account Deletion/i
    )
    expect(confirmationDialogTitle).toBeInTheDocument()

    // Get the confirmation dialog
    const confirmationDialog =
      confirmationDialogTitle.closest('[role="dialog"]')
    expect(confirmationDialog).toBeInTheDocument()

    // Ensure confirmationDialog is not null and is an HTMLElement
    if (confirmationDialog && confirmationDialog instanceof HTMLElement) {
      // Use within to scope queries to the confirmation dialog
      const { getByRole } = within(confirmationDialog)

      // Click Delete Account button in the confirmation dialog
      const confirmDeleteButton = getByRole('button', {
        name: /^Delete Account$/i
      })
      fireEvent.click(confirmDeleteButton)
    } else {
      throw new Error('Confirmation dialog not found or is not an HTMLElement')
    }

    // Handle notification dialog after account deletion
    await screen.findByText(/Account deleted successfully/i)
    fireEvent.click(screen.getByRole('button', { name: /OK/i }))

    // Expect deleteUserByUserName mutation to have been called
    expect(mockDeleteUserByUserNameMutation).toHaveBeenCalledWith('testuser')
  })

  it('displays error message when updateEmail mutation fails', async () => {
    // Simulate updateEmail mutation failure
    mockUpdateEmailMutation.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          status: 400,
          data: {
            message: 'Invalid email'
          }
        })
    })

    renderWithProviders(<UserAccount />)

    // Enter valid email
    const emailInput = screen.getByLabelText(/New Email Address/i)
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } })

    // Click Update Email button
    const updateButton = screen.getByRole('button', { name: /Update Email/i })
    fireEvent.click(updateButton)
    await act(async () => {
      await Promise.resolve()
    })

    // Expect error message to be displayed
    expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument()
  })

  it('displays error message when verifyOtp mutation fails', async () => {
    // Simulate verifyOtp mutation failure
    mockVerifyOtpMutation.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          status: 400,
          data: {
            message: 'Invalid OTP'
          }
        })
    })

    renderWithProviders(<UserAccount />)

    // Simulate opening OTP modal
    const emailInput = screen.getByLabelText(/New Email Address/i)
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } })
    const updateButton = screen.getByRole('button', { name: /Update Email/i })
    fireEvent.click(updateButton)

    // Handle notification dialog
    const notificationMessage = await screen.findByText(
      /OTP is sent successfully to your new email address\./i
    )
    expect(notificationMessage).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /OK/i }))

    // Wait for OTP input to appear
    const otpInput = await screen.findByLabelText(/Enter OTP/i)
    expect(otpInput).toBeInTheDocument()

    // Enter OTP
    fireEvent.change(otpInput, { target: { value: '123456' } })

    // Click Verify OTP button
    const verifyOtpButton = screen.getByRole('button', {
      name: /^Verify OTP$/i
    })
    fireEvent.click(verifyOtpButton)

    // Handle error notification dialog
    const errorMessage = await screen.findByText(/Invalid OTP/i)
    expect(errorMessage).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /OK/i }))
  })
})
