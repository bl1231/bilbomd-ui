// import { render } from '@testing-library/react'
// import { ThemeContextProvider } from 'themes/ThemeContextProvider'
// import { useThemeContext } from 'themes/ThemeContextProvider'
import App from './App'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from 'test/test-utils'

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<App />)
    expect(container).toBeInTheDocument()
  })
  // it('applies the correct theme from ThemeContext', () => {
  //   const mockTheme = {
  //     palette: { mode: 'dark' },
  //     unstable_sx: {},
  //     unstable_sxConfig: {},
  //     mixins: {},
  //     shadows: [],
  //     typography: {},
  //     spacing: () => 0,
  //     shape: {},
  //     transitions: {},
  //     zIndex: {},
  //     components: {},
  //     direction: 'ltr',
  //     breakpoints: {},
  //     overrides: {},
  //     props: {}
  //   }
  //   vi.mocked(useThemeContext).mockReturnValue({ theme: mockTheme })

  //   const { getByTestId } = renderWithProviders(<App />)

  //   const themeProvider = getByTestId('ThemeProvider') // Ensure your ThemeProvider or App has the test id
  //   expect(themeProvider).toHaveStyle('palette-mode: dark') // Adjust this style check to how MUI actually renders it
  // })
})
