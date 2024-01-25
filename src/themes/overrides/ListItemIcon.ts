import { blueGrey } from '@mui/material/colors'

export default function ListItemIcon(theme) {
  // console.log('ListItemIcon', theme.palette.mode)
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 24,
          color: theme.palette.mode === 'light' ? blueGrey[800] : blueGrey[100]
        }
      }
    }
  }
}
