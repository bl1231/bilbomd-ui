import {
  Paper,
  Grid,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'

export interface StatsPanelProps {
  stats: {
    userCount: number
    jobCount: number
    totalJobsFromUsers: number
    jobTypes: Record<string, number>
  }
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  if (!stats) return null
  const { userCount, jobCount, totalJobsFromUsers, jobTypes } = stats

  return (
    <Paper elevation={1} sx={{ p: 3, margin: 'auto' }}>
      <Typography variant='h5' gutterBottom>
        System Statistics
      </Typography>

      <Grid container spacing={2}>
        <Grid>
          <Typography variant='subtitle1' color='text.secondary'>
            Users
          </Typography>
          <Typography variant='h6'>{userCount}</Typography>
        </Grid>
        <Grid>
          <Typography variant='subtitle1' color='text.secondary'>
            Current Jobs
          </Typography>
          <Typography variant='h6'>{jobCount}</Typography>
        </Grid>
        <Grid>
          <Typography variant='subtitle1' color='text.secondary'>
            Total Jobs (All Time)
          </Typography>
          <Typography variant='h6'>{totalJobsFromUsers}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant='subtitle1' gutterBottom>
        Jobs by Type
      </Typography>
      <List dense>
        {Object.entries(jobTypes).map(([type, count]) => (
          <ListItem key={type} disableGutters>
            <ListItemText primary={type.toUpperCase()} />
            <Chip label={count} color='primary' />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default StatsPanel
