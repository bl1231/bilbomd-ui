import { useEffect, useRef, useState } from 'react'
import { Button, Typography, CircularProgress } from '@mui/material'
import { Box, Container } from '@mui/system'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'features/auth/authSlice'
import { useRefreshMutation } from 'features/auth/authApiSlice'
import usePersist from 'hooks/usePersist'
import useTitle from 'hooks/useTitle'
import { version } from '../../package.json'

type HomeProps = {
  title?: string
}

const Home = ({ title = 'BilboMD' }: HomeProps) => {
  useTitle(title)
  const navigate = useNavigate()
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)

  const [trueSuccess, setTrueSuccess] = useState<boolean>(false)
  const [refresh, { isUninitialized, isLoading, isSuccess }] = useRefreshMutation()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
        setTrueSuccess(true)
      } catch (error) {
        console.error('verifyRefreshToken error:', error)
      }
    }
    if (!token && persist) verifyRefreshToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let content

  if (isLoading) {
    // console.log('Home - isLoading')
    content = <CircularProgress />
  } else if (isSuccess && trueSuccess) {
    // console.log('Home - trueSuccess')
    navigate('welcome')
  } else if (token && isUninitialized) {
    // console.log('Home - isUninitialized')
    // As per PersistLogin.jsx I think this is the same as
    // above isSuccess && trueSuccess
    // I'm attempting to prevent the flash of unauthenticated Home page.
    content = <CircularProgress />
  } else {
    // console.log('Home - default')
    content = (
      <Container>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h1" sx={{ my: 3 }}>
              Welcome to BilboMD
            </Typography>
          </Box>
          <Box sx={{ m: 2, p: 0 }}>
            <Typography variant="body1" sx={{ my: 1 }}>
              <b>BilboMD</b> allows you to determine the three-dimensional domain
              structure of proteins based on conformational sampling using a Molecular
              Dynamics (MD) approach. Conformational sampling performed by{' '}
              <Link to="https://academiccharmm.org/documentation">CHARMM</Link> is
              followed by structure validation using{' '}
              <Link to="https://modbase.compbio.ucsf.edu/foxs/about">FoXS</Link> and
              ensemble analysis using Minimal Ensemble Search (MES) via{' '}
              <Link to="https://modbase.compbio.ucsf.edu/multifoxs/">MultiFoXS</Link>.
              Details of the implementation and integration of these tools into{' '}
              <b>BilboMD</b> are described in the following manuscript:
            </Typography>
            <Typography variant="body2" sx={{ mx: 5, my: 2 }}>
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
            <Typography variant="body1" sx={{ my: 3 }}>
              The new <b>BilboMD</b> webapp is still in development. However, we would
              appreciate you testing and reporting your experience.
            </Typography>
            <>
              Current Features:
              <ul>
                <li>
                  Registered users can submit <b>BilboMD</b> jobs to our cluster.
                </li>
                <li>Sends an email notification when your job is complete.</li>
                <li>
                  Provides an interactive tool to help you create CHARMM-compatible{' '}
                  <code>const.inp</code> files.
                </li>
                <li>
                  You can see the status and history of your <b>BilboMD</b> jobs.
                </li>
                <li>
                  Provides a download link to retrieve <code>results.tar.gz</code> file
                </li>
              </ul>
            </>
          </Box>
          <Box sx={{ my: 2, p: 1 }}>
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
          <Box sx={{ my: 2, p: 1 }}>
            {process.env.NODE_ENV === 'development' ? (
              <Typography variant="caption">
                mode: development BilboMD v{version}
              </Typography>
            ) : (
              ''
            )}
          </Box>
        </Box>
      </Container>
    )
  }

  return content
}

export default Home
