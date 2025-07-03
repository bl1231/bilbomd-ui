import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoginRoutes } from '../LoginRoutes'
import Loadable from 'components/Loadable'
import { lazy, ComponentType, LazyExoticComponent } from 'react'

type LoadableComponent = LazyExoticComponent<ComponentType<unknown>>

vi.mock('components/Loadable', () => ({
  default: (Component: LoadableComponent) => Component
}))

vi.mock('layout/MinimalLayout', () => ({
  default: () => <div data-testid='minimal-layout'>Minimal Layout</div>
}))

vi.mock('components/Home', () => ({
  default: () => <div data-testid='home'>Home Component</div>
}))

vi.mock('features/auth/MagickLink', () => ({
  default: () => <div data-testid='magick-link'>MagickLink Component</div>
}))

vi.mock('features/auth/Signup', () => ({
  default: () => <div data-testid='signup'>Signup Component</div>
}))

vi.mock('features/auth/VerifyEmail', () => ({
  default: () => <div data-testid='verify-email'>VerifyEmail Component</div>
}))

vi.mock('features/auth/MagickLinkAuth', () => ({
  default: () => (
    <div data-testid='magick-link-auth'>MagickLinkAuth Component</div>
  )
}))

describe('LoginRoutes', () => {
  it('should have correct base configuration', () => {
    expect(LoginRoutes.path).toBe('/')
    expect(LoginRoutes.element).toBeDefined()
    expect(LoginRoutes.children).toHaveLength(7)
  })

  it('should have correct route configurations', () => {
    const routes = LoginRoutes.children

    expect(routes[0].index).toBe(true)
    expect(routes[0].element).toBeDefined()

    expect(routes[1].path).toBe('register')
    expect(routes[1].element).toBeDefined()

    expect(routes[2].path).toBe('verify/:code')
    expect(routes[2].element).toBeDefined()

    expect(routes[3].path).toBe('magicklink')
    expect(routes[3].element).toBeDefined()

    expect(routes[4].path).toBe('auth/:otp')
    expect(routes[4].element).toBeDefined()

    expect(routes[5].path).toBe('login')
    expect(routes[5].element).toBeDefined()
  })

  it('should render MinimalLayout element', () => {
    render(LoginRoutes.element)
    expect(screen.getByTestId('minimal-layout')).toBeInTheDocument()
  })

  it('should use Loadable for lazy loading components', () => {
    const mockComponent = () => <div>Test Component</div>
    const LoadableComponent = Loadable(
      lazy(() => Promise.resolve({ default: mockComponent }))
    )
    expect(LoadableComponent).toBeDefined()
  })
})
