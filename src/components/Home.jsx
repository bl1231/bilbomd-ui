import { Typography } from '@mui/material'
import { Container } from '@mui/system'
import { Link } from 'react-router-dom'

const Home = () => {
  const content = (
    <Container>
      <Typography variant="h1">Welcome to BilboMD</Typography>
      <Typography variant="body1">A Molecualr Dynamics tool for your SAXS data.</Typography>
      <Typography variant="body1">
        <b>BilboMD</b> runs on dedicated servers at the SIBYSL beamline. Please register for an
        account in order to use this public resource.
      </Typography>
    </Container>
  )
  return content
}

export default Home
