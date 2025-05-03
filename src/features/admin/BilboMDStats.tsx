import React from 'react'
import {
  Grid,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Box,
  Alert
} from '@mui/material'
import { useGetStatsQuery } from 'slices/statsApiSlice'
import { grey } from '@mui/material/colors'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export interface StatsPanelProps {
  stats: {
    userCount: number
    jobCount: number
    totalJobsFromUsers: number
    jobTypes: Record<string, number>
  } | null
}

const StatsPanel = () => {
  const {
    data: stats,
    error: statsError,
    isLoading: statsIsLoading
  } = useGetStatsQuery('statsData', {
    pollingInterval: 10000
  })

  // Loading state
  if (statsIsLoading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  // Error state
  if (statsError) {
    return (
      <Alert severity='error'>
        {statsError ? 'and' : ''} {statsError ? 'statistics' : ''}
      </Alert>
    )
  }
  // Handle empty/fallback data
  if (!stats) {
    return <Alert severity='warning'>No statistics data available</Alert>
  }

  const { userCount, jobCount, totalJobsFromUsers, jobTypes } = stats

  return (
    <React.Fragment>
      {/* HEADER */}
      <Box
        sx={{
          backgroundColor: grey[500],
          p: 1,
          m: 0,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottom: 1,
          borderColor: grey[500]
        }}
      >
        <Typography variant='h4'>BilboMD Job Statistics</Typography>
      </Box>
      {/* SUMMARY OF USERS AND JOBS */}
      <Grid container spacing={2}>
        <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4'>Users:</Typography>
          <Chip
            label={userCount}
            sx={{
              mx: 1,
              backgroundColor: '#262626',
              color: '#bae637',
              fontSize: '1.4em',
              fontWeight: 'bold'
            }}
          />
          <Typography variant='h4'>Jobs:</Typography>
          <Chip
            label={jobCount}
            sx={{
              mx: 1,
              backgroundColor: '#262626',
              color: '#bae637',
              fontSize: '1.4em',
              fontWeight: 'bold'
            }}
          />
          <Typography variant='h4'>Total Jobs (All Time):</Typography>
          <Chip
            label={totalJobsFromUsers}
            sx={{
              mx: 1,
              backgroundColor: '#262626',
              color: '#bae637',
              fontSize: '1.4em',
              fontWeight: 'bold'
            }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* PIE CHART */}
      <Box sx={{ justifyContent: 'center', display: 'flex' }}>
        <ResponsiveContainer width='100%' height={250}>
          <PieChart width={500} height={250}>
            <Pie
              data={Object.entries(jobTypes ?? {}).map(([name, value]) => ({
                name,
                value
              }))}
              cx='50%'
              cy='99%'
              outerRadius={200}
              fill='#8884d8'
              dataKey='value'
              startAngle={0}
              endAngle={180}
              label
            >
              {Object.entries(jobTypes ?? {}).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d0ed57'][
                      index % 5
                    ]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box display='flex' justifyContent='center' flexWrap='wrap' mt={2}>
        {Object.entries(jobTypes).map(([type, count], index) => (
          <Chip
            key={type}
            label={`${type}: ${count}`}
            sx={{
              m: 0.5,
              backgroundColor: [
                '#8884d8',
                '#82ca9d',
                '#ffc658',
                '#ff7300',
                '#d0ed57'
              ][index % 5],
              color: '#000',
              fontWeight: 'bold'
            }}
          />
        ))}
      </Box>
    </React.Fragment>
  )
}

export default StatsPanel
