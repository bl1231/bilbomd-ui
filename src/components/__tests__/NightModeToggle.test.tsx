import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NightModeToggle from '../NightModeToggle' // Adjust the path as necessary

// Mock the useThemeContext hook
vi.mock('../themes/ThemeContext', () => ({
  __esModule: true,
  useThemeContext: vi.fn(() => ({
    mode: 'light',
    toggleColorMode: vi.fn()
  }))
}))

describe('NightModeToggle Component', () => {
  it('renders with light mode initially', () => {
    render(<NightModeToggle />)

    // Check if the component displays "light mode"
    expect(screen.getByText(/dark mode/i)).toBeInTheDocument()

    // Check if the Brightness4Icon is rendered (indicating light mode)
    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('Brightness4Icon')
    )
  })
})
