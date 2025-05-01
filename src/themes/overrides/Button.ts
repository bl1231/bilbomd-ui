import { Theme } from '@mui/material/styles'

export default function Button(theme: Theme) {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[700]
    }
  }

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&.job-details-button': {
            height: '24px',
            backgroundColor: theme.palette.grey[200],
            '&:hover': {
              backgroundColor: 'white'
            }
          }
        },
        contained: {
          ...disabledStyle
        },
        outlined: {
          ...disabledStyle
        }
      }
    }
  }
}
