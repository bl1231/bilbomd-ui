import { renderWithProviders } from 'test/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserAccount from './UserAccount'
import { beforeEach } from 'node:test'

describe('UserAccount Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders without crashing', () => {
    // Render the component
    const { container } = renderWithProviders(<UserAccount />)

    // Ensure that the component renders and does not crash
    expect(container).toBeInTheDocument()
  })
})
