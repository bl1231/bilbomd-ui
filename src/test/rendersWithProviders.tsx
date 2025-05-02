import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { setupStore } from 'app/store'
import { StyledEngineProvider } from '@mui/system'
import { ThemeContextProvider } from 'themes/ThemeContextProvider'
import { createMemoryRouter, RouterProvider } from 'react-router'

// Optional: add types for parameters if desired

export const renderWithProviders = (
  ui: React.ReactElement,
  { store = setupStore(), route = '/*', ...renderOptions } = {}
) => {
  const router = createMemoryRouter([{ path: route, element: ui }], {
    initialEntries: [route]
  })

  return render(
    <ThemeContextProvider>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </StyledEngineProvider>
    </ThemeContextProvider>,
    renderOptions
  )
}
