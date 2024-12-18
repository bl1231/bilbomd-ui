import React, { useEffect, useState } from 'react'
import {
  Typography,
  CircularProgress,
  Link,
  Alert,
  Container
} from '@mui/material'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
import { useRefreshMutation } from 'slices/authApiSlice'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import usePersist from 'hooks/usePersist'
import useTitle from 'hooks/useTitle'
import useTheme from '@mui/material/styles/useTheme'
import Introduction from '../features/shared/Introduction'
import FeaturesList from '../features/shared/FeaturesList'
import PipelineOptions from '../features/shared/PipelineOptions'
import AdditionalInfo from '../features/shared/AdditionalInfo'

const Home = ({ title = 'BilboMD' }) => {
  useTitle(title)
  const { data: config, isLoading: configIsLoading } = useGetConfigsQuery({})
  const theme = useTheme()
  const isLightMode = theme.palette.mode === 'light'
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
  }, [token, persist, refresh])

  let content

  if (isLoading || configIsLoading) {
    content = <CircularProgress />
  } else if (isSuccess && trueSuccess) {
    navigate('welcome')
  } else if (token && isUninitialized) {
    content = <CircularProgress />
  } else {
    // Define the features
    const features: React.ReactNode[] = [
      <>
        Registered users can submit <b>BilboMD</b> jobs to our server.
      </>,
      <>
        BilboMD jobs can be run in different modes depending on your input
        preferences:
        <ul>
          <li>
            <b>Classic (PDB)</b> mode where you supply a starting model in PDB
            format and your own MD constraints file and have more control over
            the settings
          </li>
          <li>
            <b>Classic (CRD/PSF)</b> mode where you supply a starting model that
            has already been parameterized for CHARMM as a *.crd and *.psf
            files. This is typically done with{' '}
            <Link
              href='https://www.charmm-gui.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              CHARMM-GUI
            </Link>
            . You also provide your own MD constraints file and have more
            control over the settings
          </li>
          <li>
            <b>Auto</b> mode where MD constraints are determined automagically
            from Alphafold PAE/pLDDT values, and you provide a starting model
            obtained from AlphaFold.
          </li>
          <li>
            <b>
              AF (AlphaFold) - <em>at NERSC only</em>
            </b>{' '}
            mode where you provide the amino acid sequence and let BilboMD run
            AlphaFold followed by the standard BilboMD pipeline.
          </li>
          <li>
            <b>
              SANS - <em>coming soon</em>
            </b>{' '}
            mode which has been designed to run the Classic BilboMD pipeline
            with SANS experimental data. BilboMD SANS uses Pepsi-SANS to
            calculate theoretical SANS scattering curves from the MD models and
            then a genetic algorithm to fit the theoretical curves to the
            experimental data.
          </li>
          <li>
            <b>
              Scoper - <em>at BL12.3.1 only</em>
            </b>{' '}
            mode where you provide an RNA pdb file. Scoper is a novel data
            analysis pipeline that uses a combination of classical algorithms
            and deep-learning techniques to find structures, along with
            magnesium ion binding sites that fit a given SAXS profile, given an
            initial structure to work with.
          </li>
        </ul>
      </>,
      'Sends an email notification when your job is complete.',
      <>
        Provides an two interactive tools (Jiffys) to help you create
        CHARMM-compatible <code>const.inp</code> files.
        <ul>
          <li>
            Fully manual <b>inp Jiffy{'\u2122'}</b> allows you to upload a PDB
            file and will use validation tools to ensure you are able to create
            a fully CHARMM-compatible constraint file.
          </li>
          <li>
            Automagic <b>PAE Jiffy{'\u2122'}</b> allows you to upload Alphafold
            PDB and PAE JSON files from Alphafold. This Jiffy will then use a
            community clustering algorithm along with the pLDDT values in the
            Alphafold PDB file B-factor column to automagically determine
            optimal rigid and flexible regions of your model.
          </li>
        </ul>
      </>,
      <>
        You can see the status and history of your <b>BilboMD</b> jobs.
      </>,
      <>
        Provides a download link to retrieve the <code>results.tar.gz</code>{' '}
        file.
      </>,
      <>
        Currently we store <b>BilboMD</b> job results for <b>60 days</b>, so be
        sure to download your results if they are important to you.
      </>
    ]

    // Define the pipeline options
    const pipelines = [
      {
        title: 'BilboMD Classic w/PDB',
        description: 'Bring your own starting PDB model and constraints.',
        imagePath: {
          light: '/images/bilbomd-classic-pdb-schematic.png',
          dark: '/images/bilbomd-classic-pdb-schematic-dark.png'
        }
      },
      {
        title: 'BilboMD Classic w/CRD/PSF',
        description: 'Bring your own parameterized model and constraints.',
        imagePath: {
          light: '/images/bilbomd-classic-crd-schematic.png',
          dark: '/images/bilbomd-classic-crd-schematic-dark.png'
        }
      },
      {
        title: 'BilboMD Auto',
        description: 'Use AlphaFold models with automatic constraints.',
        imagePath: {
          light: '/images/bilbomd-auto-schematic.png',
          dark: '/images/bilbomd-auto-schematic-dark.png'
        }
      },
      {
        title: 'BilboMD AF - NERSC only',
        description: 'Provide an amino acid sequence for full processing.',
        imagePath: {
          light: '/images/bilbomd-af-schematic.png',
          dark: '/images/bilbomd-af-schematic-dark.png'
        }
      }
    ]

    content = (
      <Container>
        <Introduction title='Welcome to BilboMD'>
          <b>BilboMD</b> allows you to determine the three-dimensional domain
          structure of proteins based on conformational sampling using a
          Molecular Dynamics (MD) approach. Conformational sampling performed by{' '}
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
          . Details of the implementation and integration of these tools into{' '}
          <b>BilboMD</b> are described in the following manuscript:
          <Typography variant='body2' sx={{ mx: 5, my: 2 }}>
            Pelikan M, Hura GL, Hammel M.{' '}
            <b>
              Structure and flexibility within proteins as identified through
              small angle X-ray scattering.
            </b>{' '}
            Gen Physiol Biophys. 2009 Jun;28(2):174-89. doi:
            10.4149/gpb_2009_02_174. PMID:{' '}
            <Link
              href='https://pubmed.ncbi.nlm.nih.gov/19592714/'
              target='_blank'
              rel='noopener noreferrer'
            >
              19592714
            </Link>
            ; PMCID: PMC3773563.
          </Typography>
        </Introduction>

        {/* Config Alert */}
        {config?.useNersc?.toLowerCase() === 'false' ? (
          <Alert severity='info' variant='outlined'>
            You are about to run <b>BilboMD</b> on SIBYLS servers. If you would
            prefer to run on NERSC head over to:{' '}
            <Link
              href='https://bilbomd-nersc.bl1231.als.lbl.gov'
              target='_blank'
              rel='noopener noreferrer'
            >
              <b>bilbomd-nersc.bl1231.als.lbl.gov</b>
            </Link>
            .
          </Alert>
        ) : (
          <Alert severity='info' variant='outlined'>
            You are about to run <b>BilboMD</b> on NERSC. If you would prefer to
            run on the SIBYLS Beamline servers head over to:{' '}
            <Link
              href='https://bilbomd.bl1231.als.lbl.gov'
              target='_blank'
              rel='noopener noreferrer'
            >
              <b>bilbomd.bl1231.als.lbl.gov</b>
            </Link>
            .
          </Alert>
        )}

        {/* Pipeline Options */}
        <Typography variant='h2' sx={{ my: 3 }}>
          Pipeline Options
        </Typography>
        <PipelineOptions pipelines={pipelines} isLightMode={isLightMode} />

        {/* Additional Information */}
        <AdditionalInfo />

        {/* Features List */}
        <FeaturesList features={features} />
      </Container>
    )
  }

  return content
}

export default Home
