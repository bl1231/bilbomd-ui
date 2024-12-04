import { Suspense, lazy } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loadable from '../Loadable'
import Loader from '../Loader'

vi.mock('../Loader', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}))

// Create a mock component to test with Loadable
const MockComponent = () => <div>Mock Component Loaded</div>

// Lazy load the mock component for testing with a delay
const LazyMockComponent = lazy(
  () =>
    new Promise<{ default: typeof MockComponent }>((resolve) =>
      setTimeout(() => resolve({ default: MockComponent }), 100)
    )
)

describe('Loadable Component', () => {
  it('displays the loader while loading', async () => {
    // Wrap LazyMockComponent with Loadable
    const LoadableMockComponent = Loadable(LazyMockComponent)

    render(
      <Suspense fallback={<Loader />}>
        <LoadableMockComponent />
      </Suspense>
    )

    // Check if Loader is displayed initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Mock Component Loaded')).toBeInTheDocument()
    })
  })

  it('renders the component once loaded', async () => {
    const LoadableMockComponent = Loadable(LazyMockComponent)

    render(
      <Suspense fallback={<Loader />}>
        <LoadableMockComponent />
      </Suspense>
    )

    // Wait for the mock component to load and verify its content
    await waitFor(() => {
      expect(screen.getByText('Mock Component Loaded')).toBeInTheDocument()
    })
  })
})
