import { Theme } from '@mui/material/styles'

export default function Dialog(theme: Theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '8px',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? '#1A2027'
              : theme.palette.background.paper
        }
      }
    }
  }
}
