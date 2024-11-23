import { renderWithProviders } from 'test/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LogOut from '../LogOut'
import { beforeEach } from 'node:test'

describe('LogOut Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders without crashing', () => {
    // Render the component
    const { container } = renderWithProviders(<LogOut />)

    // Ensure that the component renders and does not crash
    expect(container).toBeInTheDocument()
  })
})
