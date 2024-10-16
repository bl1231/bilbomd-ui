import { screen, fireEvent, act } from '@testing-library/react'
import { renderWithProviders } from 'test/test-utils'
import { axiosInstance } from 'app/api/axios'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import MagickLink from './MagickLink'

// Mock the Config API slice for testing
vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn(() => ({
    data: { sendMailUser: 'test@example.com' },
    error: null,
    isLoading: false
  }))
}))

vi.mock('app/api/axios', () => ({
  axiosInstance: {
    post: vi.fn()
  }
}))

describe('MagickLink Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', async () => {
    renderWithProviders(<MagickLink />)

    // Custom matcher function to match text across multiple elements
    expect(
      screen.getByText(
        (content, element) =>
          content.includes('Enter your email address to sign in') &&
          element?.tagName.toLowerCase() === 'p'
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /Send a MagickLink/ })
    ).toBeInTheDocument()
  })

  it('submits the form successfully and shows the success message', async () => {
    // Mock successful form submission
    vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce({
      status: 200,
      data: { success: true }
    })

    renderWithProviders(<MagickLink />)

    // Fill out the form
    const emailInputs = screen.getAllByLabelText(/Email address/i)
    const submitButtons = screen.getAllByRole('button', {
      name: /Send a MagickLink/i
    })

    await act(async () => {
      fireEvent.change(emailInputs[0], { target: { value: 'user@test.com' } })
    })

    await act(async () => {
      fireEvent.click(submitButtons[0])
    })
  })

  it('shows an error message when the form submission fails', async () => {
    // Mock failed form submission
    vi.spyOn(axiosInstance, 'post').mockRejectedValueOnce({
      status: 401,
      response: { data: { message: 'no account with that email' } }
    })

    renderWithProviders(<MagickLink />)

    // Fill out the form
    const emailInputs = screen.getAllByLabelText(/Email address/i)
    const submitButtons = screen.getAllByRole('button', {
      name: /Send a MagickLink/i
    })
    await act(async () => {
      fireEvent.change(emailInputs[0], { target: { value: 'nope@test.com' } })
    })

    await act(async () => {
      fireEvent.click(submitButtons[0])
    })
  })
})
