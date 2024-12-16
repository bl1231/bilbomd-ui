import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { useRoutes } from 'react-router'
import ThemeRoutes from '../index'
import { LoginRoutes } from '../LoginRoutes'
import { ProtectedMainRoutes } from '../MainRoutes'

vi.mock('react-router', () => ({
  useRoutes: vi.fn()
}))

vi.mock('../LoginRoutes', () => ({
  LoginRoutes: {
    path: '/login',
    element: <div>Login Route</div>
  }
}))

vi.mock('../MainRoutes', () => ({
  ProtectedMainRoutes: {
    path: '/',
    element: <div>Protected Main Route</div>
  }
}))

describe('ThemeRoutes', () => {
  it('should call useRoutes with correct route configurations', () => {
    const mockRouteElement = <div>Rendered Route</div>
    vi.mocked(useRoutes).mockReturnValue(mockRouteElement)

    render(<ThemeRoutes />)

    expect(useRoutes).toHaveBeenCalledWith([LoginRoutes, ProtectedMainRoutes])
    expect(useRoutes).toHaveBeenCalledTimes(1)
  })

  it('should return the result from useRoutes', () => {
    const mockRouteElement = <div>Rendered Route</div>
    vi.mocked(useRoutes).mockReturnValue(mockRouteElement)

    const { container } = render(<ThemeRoutes />)

    expect(container.textContent).toBe('Rendered Route')
  })

  it('should handle null return from useRoutes', () => {
    vi.mocked(useRoutes).mockReturnValue(null)

    const { container } = render(<ThemeRoutes />)

    expect(container.textContent).toBe('')
  })
})
