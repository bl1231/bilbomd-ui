import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { vi, Mock } from 'vitest'
import { useAppSelector } from '../../app/hooks'
import useAuth from '../useAuth'

// Mock dependencies
vi.mock('app/hooks', () => ({
  useAppSelector: vi.fn()
}))

describe('useAuth', () => {
  it('should return default values when no token is present', () => {
    // Mock selector to return no token
    ;(useAppSelector as Mock).mockReturnValue(null)

    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual({
      username: '',
      roles: [],
      email: '',
      isManager: false,
      isAdmin: false,
      status: 'User'
    })
  })

  it('should decode token and return user information', () => {
    const mockPayload = {
      UserInfo: {
        username: 'testuser',
        roles: ['Admin'],
        email: 'testuser@example.com'
      }
    }
    const mockToken = createTestJWT(mockPayload) // Create a test JWT token

    ;(useAppSelector as Mock).mockReturnValue(mockToken)

    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual({
      username: 'testuser',
      roles: ['Admin'],
      email: 'testuser@example.com',
      isManager: false,
      isAdmin: true,
      status: 'Admin'
    })
  })

  it('should handle multiple roles correctly', () => {
    const mockPayload = {
      UserInfo: {
        username: 'manageradmin',
        roles: ['Manager', 'Admin'],
        email: 'manageradmin@example.com'
      }
    }
    const mockToken = createTestJWT(mockPayload) // Create a test JWT token

    ;(useAppSelector as Mock).mockReturnValue(mockToken)

    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual({
      username: 'manageradmin',
      roles: ['Manager', 'Admin'],
      email: 'manageradmin@example.com',
      isManager: true,
      isAdmin: true,
      status: 'Admin' // Admin takes precedence over Manager
    })
  })
})

// Helper function to create a test JWT
// using this since we don't have access to the actual JWT token
function createTestJWT(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = 'dummy-signature'
  return `${header}.${body}.${signature}`
}
