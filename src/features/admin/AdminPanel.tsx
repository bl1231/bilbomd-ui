import React from 'react'
import { Box } from '@mui/material'
import useTitle from 'hooks/useTitle'
import StatsPanel from './BilboMDStats'
// import ConfigPanel from './ConfigPanel'
import QueueOverviewPanel from './QueueOverviewPanel'
import { grey } from '@mui/material/colors'
const AdminPanel = () => {
  useTitle('BilboMD: Admin Panel')

  return (
    <React.Fragment>
      <Box
        sx={{
          p: 0,
          border: 1,
          borderRadius: 1,
          borderColor: grey[500],
          backgroundColor: grey[200],
          mx: 'auto',
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 'calc(100vw - 260px)',
          overflow: 'hidden'
        }}
      >
        <Box>
          <QueueOverviewPanel />
        </Box>
      </Box>
      <Box
        sx={{
          p: 0,
          border: 1,
          borderRadius: 1,
          borderColor: grey[500],
          backgroundColor: grey[200],
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 'calc(100vw - 260px)',
          overflow: 'hidden'
        }}
      >
        <Box>
          <StatsPanel />
        </Box>
      </Box>
      {/* <Box>
          {' '}
          <Typography variant='h4' gutterBottom mt={4}>
            Admin Panel - Configuration
          </Typography>
          <ConfigPanel />
        </Box> */}
    </React.Fragment>
  )
}

export default AdminPanel
