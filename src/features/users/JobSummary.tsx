import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import JobDetails from '../jobs/JobDetails'
import DeleteJob from '../jobs/DeleteJob'
import { BilboMDJob } from 'types/interfaces'
import { format } from 'date-fns'

interface JobSummaryProps {
  job: BilboMDJob
}

const JobSummary = ({ job }: JobSummaryProps) => {
  return (
    <Grid>
      <Card variant='outlined' sx={{ marginBottom: '16px' }}>
        <CardContent>
          <Typography
            variant='h5'
            component='h3'
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {job.mongo.title}
            <JobDetails id={job.mongo.id} title={job.mongo.title} />
            <DeleteJob id={job.mongo.id} title={job.mongo.title} hide={false} />
          </Typography>
          <Typography variant='body2'>Status: {job.mongo.status}</Typography>
          <Typography variant='body2'>
            Created:{' '}
            {format(new Date(job.mongo.time_submitted), 'yyyy-MM-dd HH:mm')}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default JobSummary
