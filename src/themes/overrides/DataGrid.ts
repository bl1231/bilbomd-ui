import { Theme } from '@mui/material/styles'

export default function DataGrid(theme: Theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '--DataGrid-t-typography-font-body': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-small': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-large': theme.typography.fontFamily,
          fontFamily: theme.typography.fontFamily
        },
        columnHeaders: {
          '--DataGrid-t-typography-font-body': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-small': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-large': theme.typography.fontFamily,
          fontFamily: theme.typography.fontFamily,
          fontSize: '1.2em'
        },
        cell: {
          '--DataGrid-t-typography-font-body': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-small': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-large': theme.typography.fontFamily,
          fontFamily: theme.typography.fontFamily,
          fontSize: '1.1em'
        }
      }
    }
  }
}
