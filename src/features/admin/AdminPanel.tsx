import { Alert, CircularProgress, Typography, Box } from '@mui/material'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useGetStatsQuery } from 'slices/statsApiSlice'
import useTitle from 'hooks/useTitle'
import StatsPanel from './BilboMDStats'
import ConfigPanel from './ConfigPanel'

const AdminPanel = () => {
  useTitle('BilboMD: Admin Panel')
  const bullBoardUrl = '/admin/bullmq'

  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData', {
    pollingInterval: 10000
  })

  const {
    data: stats,
    error: statsError,
    isLoading: statsIsLoading
  } = useGetStatsQuery('statsData', {
    pollingInterval: 10000
  })

  // Combined loading state
  if (configIsLoading || statsIsLoading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  // Combined error state
  if (configError || statsError) {
    return (
      <Alert severity='error'>
        Error loading data: {configError ? 'configuration' : ''}{' '}
        {configError && statsError ? 'and' : ''}{' '}
        {statsError ? 'statistics' : ''}
      </Alert>
    )
  }

  // Handle empty/fallback data
  if (!config) {
    return <Alert severity='warning'>No configuration data available</Alert>
  }

  if (!stats) {
    return <Alert severity='warning'>No statistics data available</Alert>
  }

  return (
    <>
      <Typography variant='h4' gutterBottom>
        Admin Panel - Stats
      </Typography>
      <StatsPanel stats={stats} />

      <Typography variant='h4' gutterBottom mt={4}>
        Admin Panel - Configuration
      </Typography>
      <ConfigPanel config={config} />

      <Typography variant='h4' gutterBottom mt={4}>
        Admin Panel - Job Queue Management
      </Typography>
      <iframe
        src={bullBoardUrl}
        width='100%'
        height='800'
        style={{ border: 'none' }}
        title='BullBoard'
      />
    </>
  )
}

export default AdminPanel
