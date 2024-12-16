import { useEffect, useState } from 'react'
import {
  Typography,
  CircularProgress,
  Link,
  Alert,
  List,
  Paper,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material'
import { green } from '@mui/material/colors'
import { Box, Container } from '@mui/system'
import Grid from '@mui/material/Grid' // Corrected import
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
import { useRefreshMutation } from 'slices/authApiSlice'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import usePersist from 'hooks/usePersist'
import useTitle from 'hooks/useTitle'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

const About = ({ title = 'About BilboMD' }) => {
  useTitle(title)

  const { isLoading: configIsLoading, error: configError } = useGetConfigsQuery(
    {}
  )
  const navigate = useNavigate()
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)

  const [trueSuccess, setTrueSuccess] = useState(false)
  const [refresh, { isLoading, isSuccess }] = useRefreshMutation()

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
  }, [token, persist, refresh])

  let content

  if (isLoading || configIsLoading) {
    content = <CircularProgress />
  } else if (configError) {
    content = <Alert severity='error'>Error loading configuration data</Alert>
  } else if (isSuccess && trueSuccess) {
    navigate('welcome')
  } else {
    content = (
      <Container>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h1' sx={{ my: 3 }}>
              About BilboMD
            </Typography>
          </Box>
          <Box sx={{ m: 2 }}>
            <Typography variant='body1' sx={{ my: 1 }}>
              <b>BilboMD</b> is a cutting-edge tool designed for determining the
              three-dimensional domain structure of proteins through
              conformational sampling using a Molecular Dynamics (MD) approach.
              It integrates tools like{' '}
              <Link
                href='https://academiccharmm.org/documentation'
                target='_blank'
                rel='noopener noreferrer'
              >
                CHARMM
              </Link>
              ,{' '}
              <Link
                href='https://modbase.compbio.ucsf.edu/foxs/about'
                target='_blank'
                rel='noopener noreferrer'
              >
                FoXS
              </Link>
              , and{' '}
              <Link
                href='https://modbase.compbio.ucsf.edu/multifoxs/'
                target='_blank'
                rel='noopener noreferrer'
              >
                MultiFoXS
              </Link>
              .
            </Typography>

            {/* Features Section */}
            <Box sx={{ my: 3 }}>
              <Typography variant='h2'>Features</Typography>
              <ul>
                <li>
                  Submit jobs in various modes such as Classic (PDB), Classic
                  (CRD/PSF), Auto mode with AlphaFold models, and more.
                </li>
                <li>
                  Interactive tools to create CHARMM-compatible constraint
                  files.
                </li>
                <li>Email notifications upon job completion.</li>
                <li>
                  Access job status and history with downloadable results.
                </li>
                <li>
                  Support for SANS data analysis and RNA structure determination
                  (upcoming).
                </li>
              </ul>
            </Box>

            {/* Pipeline Descriptions */}
            <Box sx={{ my: 3 }}>
              <Typography variant='h2'>Pipeline Options</Typography>
              <List>
                {[
                  {
                    title: 'BilboMD Classic w/PDB',
                    description:
                      'Bring your own starting PDB model and constraints.',
                    imagePath: '/images/bilbomd-classic-pdb-schematic.png'
                  },
                  {
                    title: 'BilboMD Classic w/CRD/PSF',
                    description:
                      'Bring your own parameterized model and constraints.',
                    imagePath: '/images/bilbomd-classic-crd-schematic.png'
                  },
                  {
                    title: 'BilboMD Auto',
                    description:
                      'Use AlphaFold models with automatic constraints.',
                    imagePath: '/images/bilbomd-auto-schematic.png'
                  },
                  {
                    title: 'BilboMD AF - NERSC only',
                    description:
                      'Provide an amino acid sequence for full processing.',
                    imagePath: '/images/bilbomd-af-schematic.png'
                  }
                ].map((pipeline, index) => (
                  <Paper key={index} className='bilbomd-pipeline'>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: green[700] }}>
                          <RocketLaunchIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={pipeline.title}
                        secondary={pipeline.description}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <img
                            src={pipeline.imagePath}
                            alt={`Overview of ${pipeline.title}`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </Box>

            {/* Additional Information */}
            <Typography variant='body1' sx={{ my: 3 }}>
              We are actively developing BilboMD and welcome feedback. Please
              report issues or suggestions on our{' '}
              <Link
                href='https://github.com/bl1231/bilbomd-ui/'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub repository
              </Link>
              .
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  return content
}

export default About
