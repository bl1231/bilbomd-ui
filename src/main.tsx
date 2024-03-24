import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from 'app/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeContextProvider } from 'themes/ThemeContextProvider'
import { StyledEngineProvider } from '@mui/system'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from 'components/ErrorFallback'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <StyledEngineProvider injectFirst>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
              <Routes>
                <Route path='/*' element={<App />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </ReduxProvider>
      </StyledEngineProvider>
    </ThemeContextProvider>
  </React.StrictMode>
)
