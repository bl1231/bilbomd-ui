import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  Typography
} from '@mui/material'

export interface ConfigPanelProps {
  config: Record<string, unknown> | null
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const ConfigPanel = ({ config }: ConfigPanelProps) => {
  if (!config) return null

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
            {Object.entries(config).map(([key, value]) => (
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
