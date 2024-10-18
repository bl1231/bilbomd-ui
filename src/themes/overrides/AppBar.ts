import { grey, blueGrey } from '@mui/material/colors'

import { Theme } from '@mui/material/styles'

export default function AppBar(theme: Theme) {
  return {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            theme.palette.mode === 'light' ? blueGrey[800] : grey[900],
          color: theme.palette.mode === 'light' ? blueGrey[200] : blueGrey[100]
        }
      }
    }
  }
}
