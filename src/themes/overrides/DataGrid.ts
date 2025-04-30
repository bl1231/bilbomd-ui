import { Theme } from '@mui/material/styles'

export default function DataGrid(theme: Theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '--DataGrid-t-typography-font-body': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-small': theme.typography.fontFamily,
          '--DataGrid-t-typography-font-large': theme.typography.fontFamily,
          fontFamily: theme.typography.fontFamily,
          '& .bilbomd.completed': {
            backgroundColor: theme.palette.bilbomdStatus.completed,
            color: '#1a3e72',
            fontWeight: 600,
            fontFamily: 'monospace',
            textAlign: 'center'
          },
          '& .bilbomd.error': {
            backgroundColor: theme.palette.bilbomdStatus.error,
            color: '#fff',
            fontWeight: 600,
            fontFamily: 'monospace',
            textAlign: 'center'
          },
          '& .bilbomd.running': {
            backgroundColor: theme.palette.bilbomdStatus.running,
            color: '#1a3e72',
            fontWeight: 600,
            fontFamily: 'monospace',
            textAlign: 'center'
          },
          '& .bilbomd.submitted': {
            backgroundColor: theme.palette.bilbomdStatus.submitted,
            color: '#1a3e72',
            fontWeight: 600,
            fontFamily: 'monospace',
            textAlign: 'center'
          },
          '& .bilbomd.pending': {
            backgroundColor: theme.palette.bilbomdStatus.pending,
            color: '#1a3e72',
            fontWeight: 500,
            fontFamily: 'monospace',
            textAlign: 'center'
          },
          '& .bilbomd.failed': {
            backgroundColor: theme.palette.bilbomdStatus.failed,
            color: '#1a3e72',
            fontWeight: 600,
            fontFamily: 'monospace',
            textAlign: 'center'
          },
          '& .bilbomd.cancelled': {
            backgroundColor: theme.palette.bilbomdStatus.cancelled,
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
            fontWeight: 500,
            textAlign: 'center'
          },
          '& .bilbomd.unknown': {
            backgroundColor: theme.palette.bilbomdStatus.unknown,
            color: theme.palette.secondary.dark,
            fontWeight: 500,
            textAlign: 'center'
          }
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
