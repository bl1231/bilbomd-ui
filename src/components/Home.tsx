import { useEffect, useState } from 'react'
import { Button, Typography, CircularProgress, Link } from '@mui/material'
import { Box, Container } from '@mui/system'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
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
  const [refresh, { isUninitialized, isLoading, isSuccess }] =
    useRefreshMutation()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh({})
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
            <Typography variant='h1' sx={{ my: 3 }}>
              Welcome to BilboMD
            </Typography>
          </Box>
          <Box sx={{ m: 2, p: 0 }}>
            <Typography variant='body1' sx={{ my: 1 }}>
              <b>BilboMD</b> allows you to determine the three-dimensional
              domain structure of proteins based on conformational sampling
              using a Molecular Dynamics (MD) approach. Conformational sampling
              performed by{' '}
              <Link
                href='https://academiccharmm.org/documentation'
                target='_blank'
                rel='noopener noreferrer'
              >
                CHARMM
              </Link>{' '}
              is followed by structure validation using{' '}
              <Link
                href='https://modbase.compbio.ucsf.edu/foxs/about'
                target='_blank'
                rel='noopener noreferrer'
              >
                FoXS
              </Link>{' '}
              and ensemble analysis using Minimal Ensemble Search (MES) via{' '}
              <Link
                href='https://modbase.compbio.ucsf.edu/multifoxs/'
                target='_blank'
                rel='noopener noreferrer'
              >
                MultiFoXS
              </Link>
              . Details of the implementation and integration of these tools
              into <b>BilboMD</b> are described in the following manuscript:
            </Typography>
            <Typography variant='body2' sx={{ mx: 5, my: 2 }}>
              Pelikan M, Hura GL, Hammel M.{' '}
              <b>
                Structure and flexibility within proteins as identified through
                small angle X-ray scattering.
              </b>{' '}
              Gen Physiol Biophys. 2009 Jun;28(2):174-89. doi:
              10.4149/gpb_2009_02_174. PMID: ,
              <Link
                href='https://pubmed.ncbi.nlm.nih.gov/19592714/'
                target='_blank'
                rel='noopener noreferrer'
              >
                19592714
              </Link>
              ; PMCID: PMC3773563.
            </Typography>
            <Typography variant='body1' sx={{ my: 1 }}>
              <b>BilboMD</b> runs on dedicated servers at the SIBYLS beamline.
              Please register for an account in order to use this public
              resource.
            </Typography>
            <Typography variant='body1' sx={{ my: 3 }}>
              <b>BilboMD</b> is still in development. However, we would
              appreciate you testing and reporting your experience.
            </Typography>
            <>
              Current Features:
              <ul>
                <li>
                  Registered users can submit <b>BilboMD</b> jobs to our
                  cluster.
                </li>
                <li>
                  <b>BilboMD</b> jobs can be run in <b>Classic</b> mode where
                  you supply your own MD constraints file and have more control
                  over the settings or the new <b>Auto</b> mode where MD
                  constraints are determined automagically from Alphafold
                  PAE/pLDDT values.
                </li>
                <li>
                  <b>BilboMD</b> will send an email notification when your job
                  is complete.
                </li>
                <li>
                  Provides an two interactive tools (Jiffys) to help you create
                  CHARMM-compatible <code>const.inp</code> files.
                  <ul>
                    <li>
                      Fully manual <b>inp Jiffy{'\u2122'}</b> allows you to
                      upload a PDB file and will use validation tools to ensure
                      you are able to create a fully CHARMM-compatible
                      constraint file.
                    </li>
                    <li>
                      Automagic <b>PAE Jiffy{'\u2122'}</b> allows you to upload
                      Alphafold PDB and PAE JSON files from Alphafold. This
                      Jiffy will then use a community clustering algorithm along
                      with the pLDDT values in the Alphafold PDB file B-factor
                      column to automagically determine optimal rigid and
                      flexible regions of your model.
                    </li>
                  </ul>
                </li>
                <li>
                  You can see the status and history of your <b>BilboMD</b>{' '}
                  jobs.
                </li>
                <li>
                  Provides a download link to retrieve{' '}
                  <code>results.tar.gz</code> file
                </li>
                <li>
                  Currently we store <b>BilboMD</b> job results for{' '}
                  <b>60 days</b> so be sure to download your results if they are
                  important to you.
                </li>
              </ul>
            </>
          </Box>
          <Box sx={{ my: 2, p: 1 }}>
            <Button
              variant='contained'
              to='register'
              component={RouterLink}
              sx={{ my: 2, mr: 2 }}
            >
              Register
            </Button>
            <Button
              variant='contained'
              to='login'
              component={RouterLink}
              sx={{ my: 2, mr: 2 }}
            >
              Login
            </Button>
          </Box>
          <Box sx={{ my: 2, p: 1 }}>
            {process.env.NODE_ENV === 'development' ? (
              <Typography variant='caption'>
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
