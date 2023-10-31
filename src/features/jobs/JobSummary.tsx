import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import JobDetails from './JobDetails'
import DeleteJob from './DeleteJob'
import { BilboMDJob } from 'types/interfaces'

interface JobSummaryProps {
  job: BilboMDJob
}

const JobSummary = ({ job }: JobSummaryProps) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card variant="outlined" sx={{ marginBottom: '16px' }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h3"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {job.mongo.title}
              <JobDetails id={job.mongo.id} title={job.mongo.title} />
              <DeleteJob id={job.mongo.id} title={job.mongo.title} />
            </Typography>
            <Typography variant="body2">Status: {job.mongo.status}</Typography>
            <Typography variant="body2">Created At: {job.mongo.createdAt}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default JobSummary
