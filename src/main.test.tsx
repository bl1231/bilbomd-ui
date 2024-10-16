import { render } from '@testing-library/react'
import App from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { setupStore } from 'app/store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeContextProvider } from 'themes/ThemeContextProvider'
import { StyledEngineProvider } from '@mui/system'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from 'components/ErrorFallback'
import { describe, it, expect } from 'vitest'

// Setup the router
const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />
  }
])

describe('Main Application', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeContextProvider>
        <StyledEngineProvider injectFirst>
          <ReduxProvider store={setupStore()}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </ReduxProvider>
        </StyledEngineProvider>
      </ThemeContextProvider>
    )
    expect(container).toBeInTheDocument()
  })
})
