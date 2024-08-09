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
  console.log('project:', project)
  if (isSuccess) {
    content = (
      <Grid sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ mx: 0 }}>
          <b>BilboMD is using:</b>
        </Typography>

        <Chip
          label={projectCode}
          sx={{ mx: 0.5, fontSize: '0.9rem', fontWeight: 'bold' }}
          variant='outlined'
          style={{ backgroundColor: 'black', color: '#bae637' }}
        />
        <Typography sx={{ mx: 1 }}>
          <b>Hours Available:</b>
        </Typography>
        <Chip
          label={project.hours_given}
          sx={{ mx: 0.5, fontSize: '0.9rem', fontWeight: 'bold' }}
          variant='outlined'
          style={{ backgroundColor: 'black', color: '#bae637' }}
        />
        <Typography sx={{ mx: 1 }}>
          <b>Hours Used:</b>
        </Typography>
        <Chip
          label={project.hours_used.toFixed(2)}
          sx={{ mx: 0.5, fontSize: '0.9rem', fontWeight: 'bold' }}
          variant='outlined'
          style={{ backgroundColor: 'black', color: '#bae637' }}
        />
      </Grid>
    )
  }
  return content
}

export default ProjectHours
