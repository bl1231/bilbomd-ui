import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert
} from '@mui/material'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

export interface ConfigPanelProps {
  config: Record<string, unknown> | null
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const ConfigPanel = () => {
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData', {
    pollingInterval: 10000
  })
  // Loading state
  if (configIsLoading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    )
  }
  // Error state
  if (configError) {
    return (
      <Alert severity='error'>
        Error loading data: {configError ? 'configuration' : ''}{' '}
        {configError ? 'and' : ''}{' '}
      </Alert>
    )
  }
  // Handle empty/fallback data
  if (!config) {
    return <Alert severity='warning'>No configuration data available</Alert>
  }
  return (
    <>
      <Typography variant='h6' gutterBottom>
        Configuration
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Key</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(config ?? {}).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{formatValue(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ConfigPanel
