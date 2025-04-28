import { Typography, Box } from '@mui/material'

const Preferences = () => {
  return (
    <Box sx={{ backgroundColor: '#465', padding: 2, borderRadius: 1 }}>
      <Typography variant='h6'>
        User Preferences such as dark/light mode or toggle email notifications.
      </Typography>
    </Box>
  )
}

export default Preferences
