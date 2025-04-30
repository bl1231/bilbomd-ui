import { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import Typography from './typography'
import componentsOverride from './overrides'
import { green, red, amber, grey } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface Palette {
    ochre: Palette['primary']
    bilbomdStatus: {
      completed: string
      error: string
      running: string
      submitted: string
      pending: string
      failed: string
      cancelled: string
      unknown: string
    }
  }

  interface PaletteOptions {
    ochre?: PaletteOptions['primary']
    bilbomdStatus?: {
      completed?: string
      error?: string
      running?: string
      submitted?: string
      pending?: string
      failed?: string
      cancelled?: string
      unknown?: string
    }
  }
}

const getDesignTokens = (mode: PaletteMode) => {
  const themeTypography = Typography(`'Quicksand'`)

  const theme = createTheme({
    palette: {
      mode,
      ochre: {
        main: '#E3D026',
        light: '#E9DB5D',
        dark: '#A29415',
        contrastText: '#242105'
      },
      bilbomdStatus: {
        completed: green[500],
        error: red[500],
        running: amber[200],
        submitted: amber[100],
        pending: green[100],
        failed: red[300],
        cancelled: grey[200],
        unknown: grey[300]
      }
    },
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
