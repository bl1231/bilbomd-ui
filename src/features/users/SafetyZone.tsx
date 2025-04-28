import { Typography, Box } from '@mui/material'

const SafetyZone = () => {
  return (
    <Box sx={{ backgroundColor: '#888', padding: 2, borderRadius: 1 }}>
      {' '}
      <Typography variant='h6'>
        Delete account or report any safety issues
      </Typography>
    </Box>
  )
}

export default SafetyZone
