import { Theme } from '@mui/material/styles'

export default function Checkbox(theme: Theme) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary
        }
      }
    }
  }
}
