import React from 'react'
import {
  Typography,
  CircularProgress,
  Link,
  Alert,
  Container
} from '@mui/material'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import useTitle from 'hooks/useTitle'
import useTheme from '@mui/material/styles/useTheme'
import Introduction from '../shared/Introduction'
import FeaturesList from '../shared/FeaturesList'
import PipelineOptions from '../shared/PipelineOptions'
import AdditionalInfo from '../shared/AdditionalInfo'

const About = ({ title = 'BilboMD: About' }) => {
  useTitle(title)
  const { data: config, isLoading: configIsLoading } = useGetConfigsQuery({})
  const theme = useTheme()
  const isLightMode = theme.palette.mode === 'light'

  let content

  if (configIsLoading) {
    content = <CircularProgress />
  } else {
    // Define the features
    const features: React.ReactNode[] = [
      'Registered users can submit BilboMD jobs to our server.',
      <>
        BilboMD jobs can be run in different modes depending on your input
        preferences:
        <ul>
          <li>
            <b>Classic (PDB)</b> mode where you supply a starting model in PDB
            format and your own MD constraints file.
          </li>
          <li>
            <b>Classic (CRD/PSF)</b> mode where you supply a parameterized model
            with <code>.crd</code> and <code>.psf</code> files.
          </li>
          <li>
            <b>Auto</b> mode where MD constraints are determined automatically
            from AlphaFold PAE/pLDDT values, and you provide a starting model
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
            mode designed to run with SANS experimental data.
          </li>
          <li>
            <b>
              Scoper - <em>at BL12.3.1 only</em>
            </b>{' '}
            mode for RNA structure determination.
          </li>
        </ul>
      </>,
      'Sends an email notification when your job is complete.',
      <>
        Provides interactive tools to help you create CHARMM-compatible{' '}
        <code>const.inp</code> files:
        <ul>
          <li>
            Fully manual <b>inp Jiffy™</b> allows you to upload a PDB file and
            will use validation tools to ensure you are able to create a fully
            CHARMM-compatible constraint file.
          </li>
          <li>
            Automagic <b>PAE Jiffy™</b> allows you to upload AlphaFold PDB and
            PAE JSON files from AlphaFold.
          </li>
        </ul>
      </>,
      'You can see the status and history of your BilboMD jobs.',
      'Provides a download link to retrieve the <code>results.tar.gz</code> file.',
      'Currently we store BilboMD job results for 60 days, so be sure to download your results if they are important to you.'
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
        <Introduction title='About BilboMD'>
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
          . Details are described in the following manuscript:
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
        <AdditionalInfo githubLink='https://github.com/bl1231/bilbomd-ui' />

        <FeaturesList features={features} />
      </Container>
    )
  }

  return content
}

export default About
