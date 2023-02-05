import { Button, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { Link } from 'react-router-dom'

const Home = () => {
  const content = (
    <Container>
      <Typography
        variant="h1"
        sx={{ my: 3 }}
      >
        Welcome to BilboMD
      </Typography>
      <Typography variant="body1">A Molecualr Dynamics tool for your SAXS data.</Typography>
      <Typography variant="body1">
        <b>BilboMD</b> runs on dedicated servers at the SIBYSL beamline. Please register for an
        account in order to use this public resource.
      </Typography>
      <Button
        variant="contained"
        href="/register"
        sx={{ my: 2, mr: 2 }}
      >
        Register
      </Button>
      <Button
        variant="contained"
        href="/login"
        sx={{ my: 2, mr: 2 }}
      >
        Login
      </Button>
    </Container>
  )
  return content
}

export default Home
