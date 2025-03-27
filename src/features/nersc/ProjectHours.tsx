import { useGetProjectHoursQuery } from 'slices/nerscApiSlice'
import {
  CircularProgress,
  Alert,
  Chip,
  Typography,
  LinearProgress
} from '@mui/material'
import Grid from '@mui/material/Grid'
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
  // console.log('project:', project)
  if (isSuccess) {
    // Calculate percentages for CPU and GPU usage
    const cpuUsagePercent =
      (project.cpu_hours_used / project.cpu_hours_given) * 100
    const gpuUsagePercent =
      (project.gpu_hours_used / project.gpu_hours_given) * 100
    content = (
      <Grid
        container
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mx: 1 }}>
            <b>BilboMD is using:</b>
          </Typography>

          <Chip
            label={projectCode}
            sx={{ mx: 0.5, fontSize: '0.9rem', fontWeight: 'bold' }}
            variant='outlined'
            style={{ backgroundColor: 'black', color: '#bae637' }}
          />
        </Grid>

        {/* Top Row: CPU Hours */}
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mx: 1 }}>
            <b>CPU Hours Available:</b>
          </Typography>
          <Chip
            label={project.cpu_hours_given}
            sx={{
              mx: 0.5,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              width: '60px'
            }}
            variant='outlined'
            style={{ backgroundColor: 'black', color: '#bae637' }}
          />
          <Typography sx={{ mx: 1 }}>
            <b>CPU Hours Used:</b>
          </Typography>
          <Chip
            label={project.cpu_hours_used.toFixed(1)}
            sx={{
              mx: 0.5,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              width: '60px'
            }}
            variant='outlined'
            style={{ backgroundColor: 'black', color: '#bae637' }}
          />

          {/* CPU Usage Meter */}
          <Typography sx={{ mx: 1 }}>
            <b>CPU Usage:</b>
          </Typography>

          <LinearProgress
            variant='determinate'
            value={cpuUsagePercent}
            sx={{
              flexGrow: 1,
              height: 16,
              borderRadius: 0.8,
              backgroundColor: '#ddd',
              '& .MuiLinearProgress-bar1Determinate': {
                backgroundColor: 'green',
                borderRadius: 0.8
              }
            }}
          />

          <Typography sx={{ ml: 1 }}>
            <b>{cpuUsagePercent.toFixed(2)}%</b>
          </Typography>
        </Grid>

        {/* Bottom Row: GPU Hours */}
        <Grid
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ mx: 1 }}>
            <b>GPU Hours Available:</b>
          </Typography>
          <Chip
            label={project.gpu_hours_given}
            sx={{
              mx: 0.5,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              width: '60px'
            }}
            variant='outlined'
            style={{ backgroundColor: 'black', color: '#bae637' }}
          />
          <Typography sx={{ mx: 1 }}>
            <b>GPU Hours Used:</b>
          </Typography>
          <Chip
            label={project.gpu_hours_used.toFixed(1)}
            sx={{
              mx: 0.5,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              width: '60px'
            }}
            variant='outlined'
            style={{ backgroundColor: 'black', color: '#bae637' }}
          />

          {/* GPU Usage Meter */}
          <Typography sx={{ mx: 1 }}>
            <b>GPU Usage:</b>
          </Typography>
          <LinearProgress
            variant='determinate'
            value={gpuUsagePercent}
            sx={{
              flexGrow: 1,
              height: 16,
              borderRadius: 0.8,
              backgroundColor: '#ddd',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'green',
                borderRadius: 0.8
              }
            }}
          />
          <Typography sx={{ ml: 1 }}>
            <b>{gpuUsagePercent.toFixed(2)}%</b>
          </Typography>
        </Grid>
      </Grid>
    )
  }
  return content
}

export default ProjectHours
