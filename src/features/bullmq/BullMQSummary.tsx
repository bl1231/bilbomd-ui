import { Grid, Typography, Paper, Chip, CircularProgress } from '@mui/material'
import { useGetQueueStateQuery } from 'features/bullmq/bullmqApiSlice'
import HeaderBox from 'components/HeaderBox'

const BullMQSummary = () => {
  const {
    data: queueStatus,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetQueueStateQuery('queueList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <CircularProgress />

  if (isError) {
    console.log('err:', error)
  }

  if (isSuccess) {
    content = (
      <>
        <HeaderBox>
          <Typography>Status of Backend Server</Typography>
        </HeaderBox>

        <Paper sx={{ p: 1 }}>
          <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
            <Typography>
              Number of <b>active</b> jobs:
            </Typography>
            <Chip
              label={queueStatus.active_count}
              sx={{
                mx: 1,
                backgroundColor: '#262626',
                color: '#bae637',
                fontSize: '1.6em',
                fontWeight: 'bold'
              }}
            />
            <Typography sx={{ ml: 4 }}>Number of jobs in queue:</Typography>
            <Chip
              label={queueStatus.waiting_count}
              sx={{
                mx: 1,
                backgroundColor: '#262626',
                color: '#bae637',
                fontSize: '1.6em',
                fontWeight: 'bold'
              }}
            />
            <Typography sx={{ ml: 4 }}>Number of workers:</Typography>
            <Chip
              label={queueStatus.worker_count}
              sx={{
                mx: 1,
                backgroundColor: '#262626',
                color: '#bae637',
                fontSize: '1.6em',
                fontWeight: 'bold'
              }}
            />
          </Grid>
        </Paper>
      </>
    )
  }

  return content
}

export default BullMQSummary
