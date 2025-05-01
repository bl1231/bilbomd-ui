import { blueGrey } from '@mui/material/colors'

export default function Checkbox() {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: blueGrey[200]
        }
      }
    }
  }
}
