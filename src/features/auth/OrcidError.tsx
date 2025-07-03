import { Box, Typography, Alert, Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router'

const OrcidError = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const reason = searchParams.get('reason') || 'unknown'

  return (
    <Box maxWidth='sm' mx='auto' mt={8} textAlign='center'>
      <Alert severity='error' sx={{ mb: 3 }}>
        ORCID Authentication Failed
      </Alert>
      <Typography variant='body1' gutterBottom>
        Unfortunately, we couldn&apos;t complete your ORCID login.
      </Typography>
      <Typography variant='body2' gutterBottom>
        Reason: <strong>{reason}</strong>
      </Typography>
      <Typography variant='body2' sx={{ mt: 2 }}>
        Please check your ORCID account settings to ensure you have a
        <strong> verified</strong> and <strong>visible</strong> email address.
      </Typography>
      <Button variant='contained' sx={{ mt: 4 }} onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </Box>
  )
}

export default OrcidError
