
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import useTitle from 'hooks/useTitle'

const AdminPanel = () => {
useTitle(`BilboMD: Admin Panel`)
  const bullBoardUrl = '/admin/bullmq'

  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})

  if (configIsLoading) return <CircularProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration data</Alert>
  if (!config)
    return <Alert severity='warning'>No configuration data available</Alert>

  return (
    <>
      <h2>Admin Panel - Config</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(config).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{value as React.ReactNode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Admin Panel - Job Queue Management</h2>
      <iframe
        src={bullBoardUrl}
        width='100%'
        height='800' // Adjust the height as necessary
        style={{ border: 'none' }}
        title='BullBoard'
      ></iframe>
    </>
  )
}

export default AdminPanel
