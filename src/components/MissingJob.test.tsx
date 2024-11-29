import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MissingJob from './MissingJob' // Adjust the path as necessary

// Mock the useTitle hook
vi.mock('../hooks/useTitle', () => ({
  __esModule: true,
  default: vi.fn()
}))

describe('MissingJob Component', () => {
  it('renders an alert with the correct job id', () => {
    const testId = '12345'
    render(<MissingJob id={testId} />)

    // Check if the Alert component is rendered with the correct text
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(`No BilboMD Job with id: ${testId}`)
  })
})
