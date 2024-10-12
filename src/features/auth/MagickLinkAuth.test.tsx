import { renderWithProviders } from 'test/test-utils'
import { screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import MagickLinkAuth from './MagickLinkAuth'
import { useLoginMutation } from 'slices/authApiSlice'
import { setCredentials } from 'slices/authSlice'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn()
  }
})

vi.mock('slices/authApiSlice', () => ({
  useLoginMutation: vi.fn()
}))

vi.mock('slices/authSlice', async () => {
  const actual = await import('slices/authSlice')
  return {
    ...actual,
    setCredentials: vi.fn()
  }
})

// Mock react-redux's useDispatch
vi.mock('react-redux', async () => {
  const actual = await import('react-redux')
  return {
    ...actual,
    useDispatch: vi.fn()
  }
})

describe('MagickLinkAuth Component', () => {
  const mockLogin = vi.fn()
  const mockDispatch = vi.fn()
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.mocked(useParams).mockReturnValue({ otp: 'valid-otp' })
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(useLoginMutation).mockReturnValue([
      mockLogin,
      { isLoading: false, reset: vi.fn() }
    ])
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
  })

  it('renders loading state initially', () => {
    vi.mocked(useLoginMutation).mockReturnValue([
      mockLogin,
      { isLoading: true, reset: vi.fn() }
    ])

    renderWithProviders(<MagickLinkAuth />)

    // screen.debug()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders success message after valid OTP', async () => {
    mockLogin.mockReturnValueOnce({
      unwrap: vi.fn().mockResolvedValue({ accessToken: 'valid-token' })
    })

    renderWithProviders(<MagickLinkAuth />)
    // screen.debug()

    await waitFor(() => {
      expect(
        screen.getByText(/Your OTP has been successfully validated/i)
      ).toBeInTheDocument()
    })

    expect(mockDispatch).toHaveBeenCalledWith(
      setCredentials({ accessToken: 'valid-token' })
    )
    vi.advanceTimersByTime(3000)
    expect(mockNavigate).toHaveBeenCalledWith('../dashboard/jobs')

    // screen.debug()
  })

  it('renders error message on invalid OTP', async () => {
    mockLogin.mockRejectedValueOnce({
      data: { message: 'Invalid OTP' },
      response: { status: 409 }
    })

    renderWithProviders(<MagickLinkAuth />)

    await waitFor(() => {
      expect(screen.getByText(/Maybe your MagickLink/i)).toBeInTheDocument()
    })
  })
})
