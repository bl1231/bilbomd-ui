import { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import Typography from './typography'
import componentsOverride from './overrides'

const getDesignTokens = (mode: PaletteMode) => {
  const themeTypography = Typography(`'Quicksand'`)
  const theme = createTheme({
    palette: { mode },
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1536
      }
    },
    direction: 'ltr',
    mixins: {
      toolbar: {
        minHeight: 60,
        paddingTop: 8,
        paddingBottom: 8
      }
    },
    typography: themeTypography
  })
  theme.components = componentsOverride(theme)
  return theme
}

export { getDesignTokens }
