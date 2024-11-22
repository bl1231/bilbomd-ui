import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useNavigate } from 'react-router'
import { useSendLogoutMutation } from 'slices/authApiSlice'
import useLogout from './useLogout'

// Mock dependencies
vi.mock('react-router', () => ({
  useNavigate: vi.fn()
}))

vi.mock('slices/authApiSlice', () => ({
  useSendLogoutMutation: vi.fn()
}))

describe('useLogout', () => {
  let mockNavigate: ReturnType<typeof vi.fn>
  let mockSendLogout: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate = vi.fn()
    mockSendLogout = vi.fn().mockResolvedValue({}) // Simulate successful API call

    // Apply mocks
    ;(useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate)
    ;(useSendLogoutMutation as ReturnType<typeof vi.fn>).mockReturnValue([
      mockSendLogout
    ])
  })

  it("should call sendLogout and navigate to '/' on logout", async () => {
    const { result } = renderHook(() => useLogout())

    // Act: Call the logout function
    await act(async () => {
      await result.current()
    })

    expect(mockSendLogout).toHaveBeenCalledWith({})
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should handle errors during logout gracefully', async () => {
    // Simulate an error during the API call
    mockSendLogout.mockRejectedValue(new Error('Failed to log out'))

    const { result } = renderHook(() => useLogout())

    // Act: Call the logout function
    await act(async () => {
      try {
        await result.current()
      } catch (e) {
        // Catch any thrown errors (optional, depending on implementation)
      }
    })

    // Assert: Verify sendLogout was called, but navigation did not occur
    expect(mockSendLogout).toHaveBeenCalledWith({})
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
