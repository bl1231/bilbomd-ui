import orcidLogo from '../../assets/orcid.png'
import { Button, Container, Typography, Box } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'

const LoginPage = () => {
  const handleOrcidLogin = () => {
    window.location.href = '/api/v1/auth/orcid/login'
  }

  return (
    <Container maxWidth='sm'>
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={orcidLogo} alt='ORCID iD logo' width={100} height='auto' />
        </Box>
        <Typography variant='h4' gutterBottom>
          Sign in with ORCID
        </Typography>
        <Typography variant='body1' sx={{ mb: 4 }}>
          BilboMD uses ORCID to authenticate users. Click below to log in
          securely using your ORCID iD.
        </Typography>
        <Button
          variant='contained'
          color='primary'
          size='large'
          startIcon={<LoginIcon />}
          onClick={handleOrcidLogin}
        >
          Sign in with ORCID
        </Button>
      </Box>
    </Container>
  )
}

export default LoginPage
