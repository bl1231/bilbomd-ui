import { useEffect, useState } from 'react'
import {
  Typography,
  CircularProgress,
  Link,
  List,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Alert
} from '@mui/material'
import { Box, Container, Grid } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
import { useRefreshMutation } from 'slices/authApiSlice'
import usePersist from 'hooks/usePersist'
import useTitle from 'hooks/useTitle'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

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
  }, [])

  let content

  if (isLoading) {
    content = <CircularProgress />
  } else if (isSuccess && trueSuccess) {
    navigate('welcome')
  } else if (token && isUninitialized) {
    content = <CircularProgress />
  } else {
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
            <Alert severity='info'>
              Currently <b>BilboMD</b> runs on a dedicated server located at the
              SIBYLS Beamline (BL12.3.1) at the Advanced Light Source. We are
              developing a version of <b>BilboMD</b> that will be deployed to{' '}
              <Link
                href='https://nersc.gov/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <b>NERSC</b>
              </Link>{' '}
              that will run <b>BilboMD</b> jobs on{' '}
              <Link
                href='https://www.nersc.gov/systems/perlmutter/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <b>Perlmutter</b>
              </Link>
              . Keep your eyes out here for updates.
            </Alert>

            <List>
              <Paper elevation={3} sx={{ my: 1 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <RocketLaunchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary='BilboMD Classic w/PDB'
                    secondary='Bring your own starting PDB model and constraints'
                    sx={{ width: '25%' }}
                  />
                  <Grid container spacing={2}>
                    <Grid>
                      <img
                        src='/images/bilbomd-classic-pdb-schematic.png'
                        alt='Overview of BilboMD AF pipeline'
                        style={{ maxWidth: '92%', height: 'auto' }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              </Paper>

              <Paper elevation={3} sx={{ my: 1 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <RocketLaunchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary='BilboMD Classic w/CRD/PSF'
                    secondary='Bring your own starting paramterized model and constraints'
                    sx={{ width: '25%' }}
                  />
                  <Grid container spacing={2}>
                    <Grid>
                      <img
                        src='/images/bilbomd-classic-crd-schematic.png'
                        alt='Overview of BilboMD AF pipeline'
                        style={{ maxWidth: '92%', height: 'auto' }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              </Paper>
              <Paper elevation={3} sx={{ my: 1 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <RocketLaunchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary='BilboMD Auto'
                    secondary='Bring an existing AlphaFold model and a PAE *.json file'
                    sx={{ width: '25%' }}
                  />
                  <Grid container spacing={2}>
                    <Grid>
                      <img
                        src='/images/bilbomd-auto-schematic.png'
                        alt='Overview of BilboMD AF pipeline'
                        style={{ maxWidth: '92%', height: 'auto' }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              </Paper>
              <Paper elevation={3} sx={{ my: 1 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <RocketLaunchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary='BilboMD AF - NERSC only'
                    secondary='Bring the Amino Acid sequence and let BilboMD run AlphaFold'
                    sx={{ width: '25%' }}
                  />
                  <Grid container spacing={2}>
                    <Grid>
                      <img
                        src='/images/bilbomd-af-schematic.png'
                        alt='Overview of BilboMD AF pipeline'
                        style={{ maxWidth: '92%', height: 'auto' }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              </Paper>
            </List>

            <Typography variant='body1' sx={{ my: 3 }}>
              We are continually and actively developing <b>BilboMD</b> and
              would appreciate you testing and reporting your experience. Feel
              free to add an issue on the{' '}
              <Link
                href='https://github.com/bl1231/bilbomd-ui/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <b>blilbomd-ui</b>
              </Link>{' '}
              GitHub repository.
            </Typography>

            {/* FEATURES */}
            <Box sx={{ mb: 11 }}>
              <Typography variant='h2' sx={{ my: 3 }}>
                Current Features:
              </Typography>
              <ul>
                <li>
                  Registered users can submit <b>BilboMD</b> jobs to our server.
                </li>
                <li>
                  <b>BilboMD</b> jobs can be run in different modes depending on
                  your input preferences:
                  <ul>
                    <li>
                      <b>Classic (PDB)</b> mode where you supply a starting
                      model in PDB format and your own MD constraints file and
                      have more control over the settings
                    </li>
                    <li>
                      <b>Classic (CRD/PSF)</b> mode where you supply a starting
                      model that has already been parameterized for CHARMM as a
                      *.crd and *.psf files. This is typically done with{' '}
                      <Link
                        href='https://www.charmm-gui.org/'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        CHARMM-GUI
                      </Link>
                      . You also provide your own MD constraints file and have
                      more control over the settings
                    </li>
                    <li>
                      <b>Auto</b> mode where MD constraints are determined
                      automagically from Alphafold PAE/pLDDT values, and you
                      provide a starting model obtained from AlphaFold.
                    </li>
                    <li>
                      <b>
                        AF (AlphaFold) - <em>at NERSC only</em>
                      </b>{' '}
                      mode where you provide the amino acid sequence and let
                      BilboMD run AlphaFold followed by the standard BilboMD
                      pipeline.
                    </li>
                    <li>
                      <b>
                        SANS - <em>coming soon</em>
                      </b>{' '}
                      mode which has been designed to run the Classic BilboMD
                      pipeline with SANS experimental data. BilboMD SANS uses
                      Pepsi-SANS to calculate theoretical SANS scattering curves
                      from the MD models and then a genetic algorithm to fit the
                      theoretical curves to the experimental data.
                    </li>
                    <li>
                      <b>
                        Scoper - <em>at BL12.3.1 only</em>
                      </b>{' '}
                      mode where you provide an RNA pdb file. Scoper is a novel
                      data analysis pipeline that uses a combination of
                      classical algorithms and deep-learning techniques to find
                      structures, along with magnesium ion binding sites that
                      fit a given SAXS profile, given an initial structure to
                      work with.
                    </li>
                  </ul>
                </li>
                <li>Sends an email notification when your job is complete.</li>
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
            </Box>
          </Box>
        </Box>
      </Container>
    )
  }

  return content
}

export default Home
