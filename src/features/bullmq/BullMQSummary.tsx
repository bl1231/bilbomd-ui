import { Grid, Typography, Paper, Chip, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useGetQueueStateQuery } from 'features/bullmq/bullmqApiSlice'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px',
  py: 2
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
  })

  let content

  if (isLoading) content = <CircularProgress />

  if (isError) {
    console.log('err:', error)
  }

  if (isSuccess) {
    // console.log('queueStatus: ', queueStatus)
    content = (
      <>
        <Typography sx={HeaderThingee}>Status of Backend Server</Typography>
        <Item>
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
        </Item>
      </>
    )
  }

  return content
}

export default BullMQSummary
