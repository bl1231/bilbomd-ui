import { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'
// import { useMemo } from 'react'
// import { amber, deepOrange, grey } from '@mui/material/colors'
import Typography from './typography'
// import CustomShadows from './shadows'
import componentsOverride from './overrides'

// import Palette from './palette'

const getDesignTokens = (mode: PaletteMode) => {
  console.log(mode)
  // const theme = Palette(mode)
  const themeTypography = Typography(`'Quicksand'`)
  // const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme])
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
