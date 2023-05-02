import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { Box, Container } from '@mui/system'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'features/auth/authSlice'
import { useRefreshMutation } from 'features/auth/authApiSlice'
import usePersist from 'hooks/usePersist'

const Home = () => {
  const navigate = useNavigate()
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)
  const [trueSuccess, setTrueSuccess] = useState(false)
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        // console.log('verifying refresh token')
        try {
          //const response =
          await refresh()
          //const { accessToken } = response.data
          // needed to differentiate the isSuccess from refresh
          setTrueSuccess(true)
        } catch (err) {
          console.error(err)
        }
      }
      if (!token && persist) verifyRefreshToken()
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line
  }, [])

  let content

  if (isLoading) {
    console.log('Home - isLoading')
    content = <CircularProgress />
  } else if (isSuccess && trueSuccess) {
    console.log('Home - trueSuccess')
    navigate('welcome')
  } else if (token && isUninitialized) {
    console.log('Home - isUninitialized')
    // As per PersistLogin.jsx I think this is the same as
    // above isSuccess && trueSuccess
    // I'm attempting to prevent the flash of unauthenticated Home page.
    content = <CircularProgress />
  } else {
    console.log('Home - default')
    content = (
      <Container>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h1" sx={{ my: 3 }}>
              Welcome to BilboMD
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ my: 1 }}>
              <b>BilboMD</b> allows you to determine the three-dimensional domain
              structure of proteins based on conformational sampling using a Molecular
              Dynamics (MD) approach. Conformational sampling performed by{' '}
              <Link to="https://academiccharmm.org/documentation">CHARMM</Link> is
              followed by structure validation using{' '}
              <Link to="https://modbase.compbio.ucsf.edu/foxs/about">FoXS</Link> and
              ensemble analysis using Minimal Ensemble Search (MES).
            </Typography>
            <Typography variant="body2">
              Pelikan M, Hura GL, Hammel M.{' '}
              <b>
                Structure and flexibility within proteins as identified through small
                angle X-ray scattering.
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
          <Box>
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
  }

  return content
}

export default Home
