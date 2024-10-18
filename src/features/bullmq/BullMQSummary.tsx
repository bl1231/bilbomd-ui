import { ReactNode } from 'react'
import {
  Typography,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import { useGetQueueStateQuery } from 'features/bullmq/bullmqApiSlice'
import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

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
    isLoading,
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
  // console.log('queue data', queueStatus)

  let content: ReactNode

  if (isLoading) content = <CircularProgress />

  if (isError) {
    let errorMessage: string = 'An unknown error occurred'

    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    console.log('BullMQSummary error:', error)

    content = (
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        Error loading BullMQ Queue Status. {errorMessage}
      </Alert>
    )
  }

  if (isSuccess) {
    content = (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <HeaderBox>
          <Typography>BullMQ Status</Typography>
        </HeaderBox>

        <Item sx={{ p: 1 }}>
          <Grid container spacing={2} sx={{ display: 'flex' }}>
            <Grid size={{ xs: 6 }}>
              <Divider textAlign='left' variant='fullWidth'>
                <Chip label='BilboMD Queue' />
              </Divider>
              <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
                <Typography>
                  <b>Active</b>:
                </Typography>
                <Chip
                  label={queueStatus?.bilbomd.active_count}
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
                  label={queueStatus?.bilbomd.waiting_count}
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
                  label={queueStatus?.bilbomd.worker_count}
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

            <Grid size={{ xs: 6 }}>
              <Divider textAlign='left' variant='fullWidth'>
                <Chip label='Scoper Queue' />
              </Divider>
              <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
                <Typography>
                  <b>Active</b>:
                </Typography>
                <Chip
                  label={queueStatus?.scoper.active_count}
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
                  label={queueStatus?.scoper.waiting_count}
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
                  label={queueStatus?.scoper.worker_count}
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
        </Item>
      </Box>
    )
  }

  return content
}

export default BullMQSummary
