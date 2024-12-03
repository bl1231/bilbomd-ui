import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import useTitle from '../useTitle'

describe('useTitle', () => {
  let originalTitle: string

  beforeEach(() => {
    // Save the original document title to restore after each test
    originalTitle = document.title
    document.title = 'Initial Title'
  })

  afterEach(() => {
    // Restore the original title after each test
    document.title = originalTitle
  })

  it('should set the document title to the provided title', () => {
    // Act: Render the hook with a specific title
    renderHook(() => useTitle('New Title'))

    // Assert: Verify the document title is updated
    expect(document.title).toBe('New Title')
  })

  it('should restore the previous title when unmounted', () => {
    // Act: Render the hook and unmount it
    const { unmount } = renderHook(() => useTitle('Temporary Title'))
    expect(document.title).toBe('Temporary Title')

    unmount() // Unmount the hook

    // Assert: Verify the document title is restored to its previous value
    expect(document.title).toBe('Initial Title')
  })

  it('should update the document title when the title changes', () => {
    // Act: Render the hook and update the title prop
    const { rerender } = renderHook(({ title }) => useTitle(title), {
      initialProps: { title: 'First Title' }
    })

    expect(document.title).toBe('First Title')

    rerender({ title: 'Second Title' }) // Update the title

    // Assert: Verify the document title is updated
    expect(document.title).toBe('Second Title')
  })
})
