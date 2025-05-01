import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import JobDetails from './JobDetails'
import DeleteJob from './DeleteJob'
import { BilboMDJob } from 'types/interfaces'

interface JobSummaryProps {
  job: BilboMDJob
}

const JobSummary = ({ job }: JobSummaryProps) => {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card variant='outlined' sx={{ marginBottom: '16px' }}>
        <CardContent>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='flex-start'
            gap={1}
            mb={1}
          >
            <Typography variant='h5' component='h3'>
              {job.mongo.title}
            </Typography>
            <JobDetails id={job.mongo.id} />
            <Tooltip
              title={
                ['Submitted', 'Running'].includes(job.mongo.status)
                  ? 'Cannot delete a job that is submitted or running.'
                  : 'Delete this job'
              }
            >
              <span>
                <DeleteJob
                  id={job.mongo.id}
                  title={job.mongo.title}
                  hide={['Submitted', 'Running'].includes(job.mongo.status)}
                />
              </span>
            </Tooltip>
          </Box>
          <Typography variant='body2'>
            Status: {job.mongo.status} — Created At:{' '}
            {job.mongo.time_submitted?.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default JobSummary
