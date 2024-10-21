import { Theme } from '@mui/material/styles'
import { grey, blueGrey } from '@mui/material/colors'

export default function BilboMdPipeline(theme: Theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.bilbomd-pipeline': {
            elevation: 9,
            background:
              theme.palette.mode === 'light' ? blueGrey[200] : grey[900],
            color:
              theme.palette.mode === 'light' ? blueGrey[900] : blueGrey[100],
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(2),
            borderRadius: theme.shape.borderRadius
          }
        }
      }
    }
  }
}
