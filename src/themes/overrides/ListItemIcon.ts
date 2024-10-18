import { blueGrey } from '@mui/material/colors'
import { Theme } from '@mui/material/styles'

export default function ListItemIcon(theme: Theme) {
  // console.log('ListItemIcon', theme.palette.mode)
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 24,
          color: theme.palette.mode === 'light' ? blueGrey[600] : blueGrey[200]
        }
      }
    }
  }
}
