import { Button, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { Link } from 'react-router-dom'

const Home = () => {
  const content = (
    <Container container>
      <Box>
        <Box item sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h1" sx={{ my: 3 }}>
            Welcome to BilboMD
          </Typography>
        </Box>
        <Box item>
          <Typography variant="body1" sx={{ my: 1 }}>
            <b>BilboMD</b> allows you to determine the three-dimensional domain structure
            of proteins based on conformational sampling using a Molecular Dynamics (MD)
            approach. Conformational sampling performed by{' '}
            <Link to="https://academiccharmm.org/documentation">CHARMM</Link> is followed
            by structure validation using{' '}
            <Link to="https://modbase.compbio.ucsf.edu/foxs/about">FoXS</Link> and
            ensemble analysis using Minimal Ensemble Search (MES).
          </Typography>
          <Typography variant="body2">
            Pelikan M, Hura GL, Hammel M.{' '}
            <b>
              Structure and flexibility within proteins as identified through small angle
              X-ray scattering.
            </b>{' '}
            Gen Physiol Biophys. 2009 Jun;28(2):174-89. doi: 10.4149/gpb_2009_02_174.
            PMID: ,<Link to="https://pubmed.ncbi.nlm.nih.gov/19592714/">19592714</Link>;
            PMCID: PMC3773563.
          </Typography>
          <Typography variant="body1" sx={{ my: 1 }}>
            <b>BilboMD</b> runs on dedicated servers at the SIBYLS beamline. Please
            register for an account in order to use this public resource.
          </Typography>
        </Box>
        <Box item>
          <Button
            variant="contained"
            to="register"
            component={Link}
            sx={{ my: 2, mr: 2 }}
          >
            Register
          </Button>
          <Button variant="contained" to="login" component={Link} sx={{ my: 2, mr: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  )
  return content
}

export default Home
