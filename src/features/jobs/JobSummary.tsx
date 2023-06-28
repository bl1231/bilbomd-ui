import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import JobDetails from './JobDetails'
import DeleteJob from './DeleteJob'
import { Job } from './jobsApiSlice'

interface JobSummaryProps {
  job: Job
}

const JobSummary = ({ job }: JobSummaryProps) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: '16px' }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h3"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {job.title}
          <JobDetails job={job} />
          <DeleteJob job={job} />
        </Typography>
        <Typography variant="body2">Status: {job.status}</Typography>
        <Typography variant="body2">Created At: {job.createdAt}</Typography>
      </CardContent>
    </Card>
  )
}

export default JobSummary
