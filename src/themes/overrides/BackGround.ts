import { blueGrey } from '@mui/material/colors'

export default function BackGround(theme) {
  console.log('theme', theme)
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: theme.palette.mode === 'light' ? blueGrey[100] : blueGrey[800]
        }
      }
    }
  }
}
