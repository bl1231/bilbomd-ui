import {
  Grid,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
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

type ContentType = React.ReactNode | string

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

  let content: ContentType

  if (isLoading) content = <CircularProgress />

  if (isError) {
    console.log('err:', error)
    content = <Alert>Error loading BullMQ Queue Status.</Alert>
  }

  if (isSuccess) {
    content = (
      <>
        <HeaderBox>
          <Typography>Status of Backend Server</Typography>
        </HeaderBox>

        <Item sx={{ p: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
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

            <Grid item xs={6}>
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
      </>
    )
  }

  return content
}

export default BullMQSummary
