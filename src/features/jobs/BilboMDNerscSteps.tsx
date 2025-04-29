import { BilboMDJob } from 'types/interfaces'
import BilboMDNerscStep from './BilboMDNerscStep'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HeaderBox from 'components/HeaderBox'
import Item from 'themes/components/Item'

interface BilboMDStepsProps {
  job: BilboMDJob
}

const BilboMDNerscSteps = ({ job }: BilboMDStepsProps) => {
  // console.log('BilboMDNerscSteps: job:', job)

  let stepsToHide: string[] = []
  if (job.mongo.__t === 'BilboMdCRD') {
    stepsToHide = ['autorg', 'pdb2crd', 'pae', 'alphafold', '_id']
  } else if (job.mongo.__t === 'BilboMdAuto') {
    stepsToHide = ['autorg', 'alphafold', '_id']
  } else if (job.mongo.__t === 'BilboMdAlphaFold') {
    stepsToHide = ['autorg', '_id']
  } else if (job.mongo.__t === 'BilboMdPDB') {
    stepsToHide = ['autorg', 'pae', 'alphafold', '_id']
  }

  const stepOrder = [
    'alphafold',
    'pdb2crd',
    'pae',
    'autorg',
    'minimize',
    'initfoxs',
    'heat',
    'md',
    'dcd2pdb',
    'pdb_remediate',
    'foxs',
    'pepsisans',
    'multifoxs',
    'gasans',
    'copy_results_to_cfs',
    'results',
    'email',
    'nersc_prepare_slurm_batch',
    'nersc_submit_slurm_batch',
    'nersc_job_status',
    'nersc_copy_results_to_cfs'
  ]

  const { steps } = job.mongo

  if (steps && typeof steps === 'object') {
    const nerscSteps = Object.entries(steps)
      .filter(
        ([stepName]) =>
          stepName.startsWith('nersc_') && !stepsToHide.includes(stepName)
      )
      .sort(
        ([a], [b]) =>
          stepOrder.indexOf(a) - stepOrder.indexOf(b) || a.localeCompare(b)
      )
      .map(([stepName, stepValue]) => (
        <BilboMDNerscStep
          key={stepName}
          stepName={stepName}
          stepStatus={stepValue.status}
          stepMessage={stepValue.message}
        />
      ))

    const bilboMdSteps = Object.entries(steps)
      .filter(
        ([stepName]) =>
          !stepName.startsWith('nersc_') && !stepsToHide.includes(stepName)
      )
      .sort(
        ([a], [b]) =>
          stepOrder.indexOf(a) - stepOrder.indexOf(b) || a.localeCompare(b)
      )
      .map(([stepName, stepValue]) => (
        <BilboMDNerscStep
          key={stepName}
          stepName={stepName}
          stepStatus={stepValue.status}
          stepMessage={stepValue.message}
        />
      ))

    return (
      <Accordion defaultExpanded={job.mongo.status !== 'Completed'}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
          sx={{
            backgroundColor: '#888',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            pl: 0
          }}
        >
          <HeaderBox sx={{ py: 0 }}>
            <Typography>NERSC STEPS</Typography>
          </HeaderBox>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container sx={{ flexDirection: 'column' }}>
            {nerscSteps}
            <Divider sx={{ my: 1 }} />
            {bilboMdSteps}
            <Divider sx={{ my: 1 }} />
            <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1 }}>
                <b>INFO: </b>
              </Typography>
              {job.bullmq && job.bullmq.bilbomdLastStep ? (
                <Chip label={job.bullmq.bilbomdLastStep} size='small' />
              ) : (
                <Chip label='N/A' size='small' />
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    )
  }

  return <Item>No steps available</Item>
}

export default BilboMDNerscSteps
