import { useGetProjectHoursQuery } from './nerscApiSlice'
import { CircularProgress, Alert, Chip, Grid, Typography } from '@mui/material'
type ContentType = React.ReactNode | string

const ProjectHours = ({ projectCode }) => {
  const {
    data: project,
    isSuccess,
    error,
    isLoading
  } = useGetProjectHoursQuery(projectCode)
  let content: ContentType
  if (isLoading) content = <CircularProgress />
  if (error) {
    console.log('err:', error)
    content = <Alert>Error loading NERSC Status.{error.toString()}</Alert>
  }
  if (!project) return <div>No data available</div>
  if (isSuccess) {
    content = (
      <Grid sx={{ m: 0.5, display: 'flex', alignItems: 'center' }}>
        <Chip label={`BilboMD is using: ${projectCode}`} />
        <Typography sx={{ m: 1 }}>
          Hours Given: {project.hours_given}
        </Typography>
        <Typography sx={{ m: 1 }}>Hours Used: {project.hours_used}</Typography>
      </Grid>
    )
  }
  return content
}

export default ProjectHours
