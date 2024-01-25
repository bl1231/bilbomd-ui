import { blueGrey } from '@mui/material/colors'

export default function BackGround(theme) {
  console.log('theme', theme)
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: theme.palette.mode === 'light' ? blueGrey[50] : blueGrey[800]
        }
      }
    }
  }
}
