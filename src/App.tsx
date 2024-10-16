import Routes from 'routes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useThemeContext } from 'themes/ThemeContextProvider'

const App: React.FC = () => {
  const { theme } = useThemeContext()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  )
}

export default App
