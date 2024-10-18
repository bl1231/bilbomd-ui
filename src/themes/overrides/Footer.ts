import { grey, blueGrey } from '@mui/material/colors'
import { Theme } from '@mui/material/styles'

export default function Footer(theme: Theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.footer-paper': {
            // Target only Paper components with the "footer-paper" class
            background:
              theme.palette.mode === 'light' ? blueGrey[800] : grey[900],
            color:
              theme.palette.mode === 'light' ? blueGrey[200] : blueGrey[100],
            // marginTop: 'calc(10% + 60px)',
            width: '100%'
            // position: 'fixed', // Uncomment this line to fix the footer at the bottom of the screen
            // bottom: 0,
            // left: 0,
            // right: 0
          }
        }
      }
    }
  }
}
