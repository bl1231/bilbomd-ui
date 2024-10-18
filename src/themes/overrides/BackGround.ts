import { blueGrey } from '@mui/material/colors'
import { Theme } from '@mui/material/styles'

export default function BackGround(theme: Theme) {
  // console.log('theme', theme)
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            theme.palette.mode === 'light' ? blueGrey[50] : blueGrey[800]
        }
      }
    }
  }
}
