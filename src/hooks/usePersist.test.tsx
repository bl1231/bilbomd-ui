import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import usePersist from './usePersist'

describe('usePersist', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should initialize with the value from localStorage if it exists', () => {
    // Arrange: Set up localStorage with a value
    localStorage.setItem('persist', JSON.stringify(true))

    // Act: Render the hook
    const { result } = renderHook(() => usePersist())

    // Assert: Verify the initial state matches the value in localStorage
    expect(result.current[0]).toBe(true)
  })

  it('should initialize with false if no value exists in localStorage', () => {
    // Act: Render the hook without setting anything in localStorage
    const { result } = renderHook(() => usePersist())

    // Assert: Verify the initial state is false
    expect(result.current[0]).toBe(false)
  })

  it('should update localStorage when the state changes', () => {
    // Act: Render the hook and update the state
    const { result } = renderHook(() => usePersist())
    act(() => {
      result.current[1](true) // Update state to true
    })

    // Assert: Verify that localStorage was updated correctly
    expect(localStorage.getItem('persist')).toBe(JSON.stringify(true))
  })

  it('should persist changes to state across renders', () => {
    // Act: Render the hook and update the state
    const { result, rerender } = renderHook(() => usePersist())
    act(() => {
      result.current[1](true) // Update state to true
    })

    rerender() // Re-render the hook

    // Assert: Verify that the state remains consistent across renders
    expect(result.current[0]).toBe(true)
  })
})
