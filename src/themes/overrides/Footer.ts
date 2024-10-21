import { grey, blueGrey } from '@mui/material/colors'
import { Theme } from '@mui/material/styles'

export default function Footer(theme: Theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.footer-paper': {
            background:
              theme.palette.mode === 'light' ? blueGrey[800] : grey[900],
            color:
              theme.palette.mode === 'light' ? blueGrey[200] : blueGrey[100],
            width: '100%'
          }
        }
      }
    }
  }
}
