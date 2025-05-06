import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { setupStore } from 'app/store'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ThemeContextProvider } from 'themes/ThemeContextProvider'
import { StyledEngineProvider } from '@mui/system'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from 'components/ErrorFallback'

const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />
  }
])

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <ThemeContextProvider>
        <StyledEngineProvider injectFirst>
          <ReduxProvider store={setupStore()}>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </ReduxProvider>
        </StyledEngineProvider>
      </ThemeContextProvider>
    </React.StrictMode>
  )
}
