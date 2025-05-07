import { Typography, Box, Chip, Alert, AlertTitle } from '@mui/material'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useGetQueueStateQuery } from 'features/bullmq/bullmqApiSlice'
import HeaderBox from 'components/HeaderBox'
import Item from 'themes/components/Item'

interface QueueStatus {
  bilbomd: {
    active_count: number
    waiting_count: number
    worker_count: number
  }
  scoper: {
    active_count: number
    waiting_count: number
    worker_count: number
  }
}

const BullMQSummary = () => {
  const {
    data: queueStatus,

    isSuccess,
    isError,
    error
  } = useGetQueueStateQuery('queueList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  }) as {
    data: QueueStatus | undefined
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    error: Error
  }

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <HeaderBox>
        <Typography>BullMQ Status</Typography>
      </HeaderBox>

      <Item sx={{ p: 1 }}>
        {isError && (
          <Alert severity='error' variant='outlined' sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            <Typography variant='body2'>
              Failed to load BullMQ Queue Status from the backend.
            </Typography>
            {'status' in error && (
              <Typography variant='caption' sx={{ fontStyle: 'italic' }}>
                {`Status ${error.status}: ${
                  'data' in error
                    ? JSON.stringify(error.data)
                    : 'No additional details'
                }`}
              </Typography>
            )}
            {!('status' in error) && error?.message && (
              <Typography variant='caption' sx={{ fontStyle: 'italic' }}>
                Details: {error.message}
              </Typography>
            )}
          </Alert>
        )}

        {isSuccess && queueStatus && (
          <Grid container spacing={2} sx={{ display: 'flex' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Divider textAlign='left' variant='fullWidth'>
                <Chip label='BilboMD Queue' />
              </Divider>
              <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
                <Typography>
                  <b>Active</b>:
                </Typography>
                <Chip
                  label={queueStatus.bilbomd.active_count}
                  sx={{
                    mx: 1,
                    backgroundColor: '#262626',
                    color: '#bae637',
                    fontSize: '1.6em',
                    fontWeight: 'bold'
                  }}
                />
                <Typography sx={{ ml: 4 }}>Queued:</Typography>
                <Chip
                  label={queueStatus.bilbomd.waiting_count}
                  sx={{
                    mx: 1,
                    backgroundColor: '#262626',
                    color: '#bae637',
                    fontSize: '1.6em',
                    fontWeight: 'bold'
                  }}
                />
                <Typography sx={{ ml: 4 }}>Workers:</Typography>
                <Chip
                  label={queueStatus.bilbomd.worker_count}
                  sx={{
                    mx: 1,
                    backgroundColor: '#262626',
                    color: '#bae637',
                    fontSize: '1.6em',
                    fontWeight: 'bold'
                  }}
                />
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Divider textAlign='left' variant='fullWidth'>
                <Chip label='Scoper Queue' />
              </Divider>
              <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
                <Typography>
                  <b>Active</b>:
                </Typography>
                <Chip
                  label={queueStatus.scoper.active_count}
                  sx={{
                    mx: 1,
                    backgroundColor: '#262626',
                    color: '#bae637',
                    fontSize: '1.6em',
                    fontWeight: 'bold'
                  }}
                />
                <Typography sx={{ ml: 4 }}>Queued:</Typography>
                <Chip
                  label={queueStatus.scoper.waiting_count}
                  sx={{
                    mx: 1,
                    backgroundColor: '#262626',
                    color: '#bae637',
                    fontSize: '1.6em',
                    fontWeight: 'bold'
                  }}
                />
                <Typography sx={{ ml: 4 }}>Workers:</Typography>
                <Chip
                  label={queueStatus.scoper.worker_count}
                  sx={{
                    mx: 1,
                    backgroundColor: '#262626',
                    color: '#bae637',
                    fontSize: '1.6em',
                    fontWeight: 'bold'
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Item>
    </Box>
  )

  return content
}

export default BullMQSummary
