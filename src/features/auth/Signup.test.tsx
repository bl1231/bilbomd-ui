import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import { renderWithProviders } from 'test/test-utils'
import { axiosInstance } from 'app/api/axios'
import Signup from './Signup'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the Config API slice for testing
vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn(() => ({
    data: { sendMailUser: 'test@example.com' },
    error: null,
    isLoading: false
  }))
}))

// Mock the axiosInstance for the whole test file
vi.mock('app/api/axios', () => ({
  axiosInstance: {
    post: vi.fn()
  },
  isAxiosError: vi.fn((error) => error.isAxiosError)
}))

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', async () => {
    renderWithProviders(<Signup />)

    // Custom matcher function to match text across multiple elements
    expect(
      screen.getByText(
        (content, element) =>
          content.includes('Select a user name and enter your email address') &&
          element?.tagName.toLowerCase() === 'p'
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /Create an Account/ })
    ).toBeInTheDocument()
  })

  it('submits the form successfully and shows the success message', async () => {
    vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce({
      status: 201,
      data: { success: true }
    })

    renderWithProviders(<Signup />)

    // Simulate user input
    const usernameInputs = screen.getAllByLabelText(/Pick a User Name/i)
    await act(async () => {
      fireEvent.change(usernameInputs[0], {
        target: { value: 'testuser' }
      })
    })
    const emailInputs = screen.getAllByLabelText(/Enter an Email address/i)
    await act(async () => {
      fireEvent.change(emailInputs[0], {
        target: { value: 'test@example.com' }
      })
    })

    // Submit the form
    const submitButton = screen.getAllByRole('button', {
      name: /Create an Account/i
    })
    act(() => {
      fireEvent.click(submitButton[0])
    })
    // Wait for the success message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/You have been registered for an account/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
    })
  })

  // it('fails to submit the form when the username is a duplicate', async () => {
  //   vi.spyOn(axiosInstance, 'post').mockRejectedValueOnce({
  //     response: {
  //       status: 409,
  //       data: { message: 'Duplicate username' }
  //     }
  //   })

  //   renderWithProviders(<Signup />)

  //   // Simulate user input for duplicate username
  //   const usernameInputs = screen.getAllByLabelText(/Pick a User Name/i)
  //   fireEvent.change(usernameInputs[0], {
  //     target: { value: 'duplicateuser' }
  //   })
  //   const emailInputs = screen.getAllByLabelText(/Enter an Email address/i)
  //   fireEvent.change(emailInputs[0], {
  //     target: { value: 'test@example.com' }
  //   })

  //   // Submit the form
  //   const submitButton = screen.getAllByRole('button', {
  //     name: /Create an Account/i
  //   })
  //   await act(async () => {
  //     fireEvent.click(submitButton[0])
  //   })

  //   const alert = await screen.findByRole('alert')
  //   // Check if the alert contains the expected error message
  //   expect(alert).toHaveTextContent('Duplicate username')
  // })
})
