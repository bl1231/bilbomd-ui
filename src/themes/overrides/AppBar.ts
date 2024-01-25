import { grey, blueGrey } from '@mui/material/colors'

export default function AppBar(theme) {
  // console.log('ListItemIcon', theme.palette.mode)
  return {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: theme.palette.mode === 'light' ? blueGrey[800] : grey[900],
          color: theme.palette.mode === 'light' ? blueGrey[200] : blueGrey[100]
        }
      }
    }
  }
}
