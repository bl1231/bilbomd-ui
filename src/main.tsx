import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from 'app/store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeContextProvider } from 'themes/ThemeContextProvider'
import { StyledEngineProvider } from '@mui/system'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from 'components/ErrorFallback'

// Create a router with createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />
    // You can add loader and children here as needed
    // e.g., loader: appLoader,
    // children: [{ path: 'team', element: <Team />, loader: teamLoader }],
  }
])

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <ThemeContextProvider>
        <StyledEngineProvider injectFirst>
          <ReduxProvider store={store}>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </ReduxProvider>
        </StyledEngineProvider>
      </ThemeContextProvider>
    </React.StrictMode>
  )
}
