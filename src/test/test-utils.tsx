import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { setupStore } from 'app/store'
import type { AppStore, RootState } from 'app/store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, createTheme, Theme } from '@mui/material'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store. For
// future dependencies, such as wanting to test with react-router, you can extend
// this interface to accept a path and route and use those in a <RouterProvider />
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
  route?: string
  customTheme?: Theme
}

const defaultTheme = createTheme() // Default MUI theme

function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    route = '/*',
    customTheme = defaultTheme,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const router = createBrowserRouter(
    [
      {
        path: route,
        element: ui
      }
    ],
    {
      future: {
        v7_fetcherPersist: true,
        v7_skipActionErrorRevalidation: true,
        v7_partialHydration: true,
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true
      }
    }
  )
  // Wrapper for testing with providers
  function Wrapper(): JSX.Element {
    return (
      <Provider store={store}>
        <ThemeProvider theme={customTheme}>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
        </ThemeProvider>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export { renderWithProviders }
