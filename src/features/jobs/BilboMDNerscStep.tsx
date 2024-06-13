import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'
import ErrorIcon from '@mui/icons-material/Error'
import { Chip, Grid, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

interface BilboMDStepProps {
  stepName: string
  stepStatus: string
  stepMessage: string
}

const BilboMDNerscStep = ({
  stepName,
  stepStatus,
  stepMessage
}: BilboMDStepProps) => {
  const getStepDetails = (stepName: string) => {
    switch (stepName) {
      case 'nersc_prepare_slurm_batch':
        return {
          friendlyName: 'NERSC Prepare Slurm Batch File',
          tooltipMessage: 'In this step we run Scoper. Details are below.'
        }
      case 'nersc_submit_slurm_batch':
        return {
          friendlyName: 'NERSC Submit Slurm Batch File',
          tooltipMessage: 'In this step we run Scoper. Details are below.'
        }
      case 'nersc_job_status':
        return {
          friendlyName: 'NERSC Job Status',
          tooltipMessage: 'In this step we run Scoper. Details are below.'
        }
      case 'scoper':
        return {
          friendlyName: 'Scoper',
          tooltipMessage: 'In this step we run Scoper. Details are below.'
        }
      case 'pae':
        return {
          friendlyName: 'Define MD Domains from AlphaFold PAE matrix',
          tooltipMessage:
            'In this step the PAE matrix from Alphafold is used to define rigid bodies and rigid domains of your molecule.'
        }
      case 'autorg':
        return {
          friendlyName: 'AutoRg',
          tooltipMessage:
            'In this step we use BioXTAS to determine the Radius of gyration for your SAXS data.'
        }
      case 'pdb2crd':
        return {
          friendlyName: 'Convert PDB to CRD',
          tooltipMessage: ''
        }
      case 'minimize':
        return {
          friendlyName: 'CHARMM Minimize',
          tooltipMessage:
            'In this step we use CHARMM minimize the relax the model geometry.'
        }
      case 'initfoxs':
        return {
          friendlyName: 'Initial FoXS',
          tooltipMessage: ''
        }
      case 'heat':
        return {
          friendlyName: 'CHARMM Heating',
          tooltipMessage:
            'In this step we use CHARMM to heat and then cool your model.'
        }
      case 'md':
        return {
          friendlyName: 'CHARMM Molecular Dynamics',
          tooltipMessage:
            'In this step we use CHARMM molecular dynamics to generate possible model conformations.'
        }
      case 'dcd2pdb':
        return {
          friendlyName: 'Extract PDBs from MD Trajectories',
          tooltipMessage: ''
        }
      case 'foxs':
        return {
          friendlyName: 'FoXS Analysis',
          tooltipMessage:
            'In this step we use FoXS to calculate SAXS scattering curves from MD models.'
        }
      case 'multifoxs':
        return {
          friendlyName: 'MultiFoXS',
          tooltipMessage:
            'In this step we use MultiFoXS to determine the best FoXS curves to match your experimental SAXS data.'
        }
      case 'results':
        return {
          friendlyName: 'Create Results file for download',
          tooltipMessage:
            'In this step we are gathering the results together and creating a file for you to download.'
        }
      case 'email':
        return {
          friendlyName: 'Send Email',
          tooltipMessage:
            'n this step we send an email to let you know the BilboMD job is complete.'
        }
      default:
        return {
          friendlyName: stepName,
          tooltipMessage: ''
        }
    }
  }

  const { friendlyName, tooltipMessage } = getStepDetails(stepName)
  // console.log(stepName, stepStatus, stepMessage)
  // console.log(friendlyName, tooltipMessage)
  return (
    <Grid key={stepName} sx={{ m: 0.5, display: 'flex', alignItems: 'center' }}>
      <Tooltip title={tooltipMessage} arrow>
        <>
          <Grid item>
            <Chip
              icon={
                stepStatus === 'Waiting' ? (
                  <RadioButtonUncheckedIcon />
                ) : stepStatus === 'Running' ? (
                  <DirectionsRunRoundedIcon style={{ color: 'black' }} />
                ) : stepStatus === 'Success' ? (
                  <CheckCircleIcon />
                ) : stepStatus === 'Error' ? (
                  <ErrorIcon />
                ) : undefined
              }
              size='small'
              label={friendlyName}
              color={
                stepStatus === 'Success'
                  ? 'success'
                  : stepStatus === 'Error'
                    ? 'error'
                    : undefined
              }
              style={
                stepStatus === 'Running'
                  ? { backgroundColor: '#fff566', color: 'black' }
                  : undefined
              }
            />
          </Grid>
          <Grid item>
            <Typography variant='body2' sx={{ ml: 1 }}>
              {stepMessage || 'Waiting'}
            </Typography>
          </Grid>
        </>
      </Tooltip>
    </Grid>
  )
}

export default BilboMDNerscStep
