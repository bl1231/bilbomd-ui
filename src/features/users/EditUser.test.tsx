import { renderWithProviders } from 'test/test-utils'
import { describe, it, expect, vi } from 'vitest'
import EditUser from './EditUser'
import { beforeEach } from 'node:test'

describe('EditUser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<EditUser />)
    expect(container).toBeInTheDocument()
  })

  it('Displays BilboMD: Edit User', () => {
    renderWithProviders(<EditUser />)
    expect(document.title).toContain('BilboMD: Edit User')
  })

  it('Displays Pulse Loader', () => {
    const { container } = renderWithProviders(<EditUser />)
    expect(container).toContainHTML('PulseLoader')
  })
})
