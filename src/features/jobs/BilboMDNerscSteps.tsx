import { BilboMDJob } from 'types/interfaces'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import BilboMDNerscStep from './BilboMDNerscStep'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HeaderBox from 'components/HeaderBox'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface BilboMDStepsProps {
  job: BilboMDJob
}

const BilboMDNerscSteps = ({ job }: BilboMDStepsProps) => {
  console.log('BilboMDNerscSteps: job:', job)
  let stepsToHide: string[] = []
  if (job.mongo.__t === 'BilboMdCRD') {
    stepsToHide = ['autorg', 'pdb2crd', 'pae', 'alphafold']
  } else if (job.mongo.__t === 'BilboMdAuto') {
    stepsToHide = ['autorg']
  } else if (job.mongo.__t === 'BilboMdPDB') {
    stepsToHide = ['autorg', 'pae', 'alphafold']
  }

  const { steps } = job.mongo
  // Check if bilbomdStep is defined and not null before using Object.entries
  if (steps && typeof steps === 'object') {
    const nerscSteps = Object.entries(steps)
      .filter(
        ([stepName]) =>
          stepName.startsWith('nersc_') && !stepsToHide.includes(stepName)
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
      .map(([stepName, stepValue]) => (
        <BilboMDNerscStep
          key={stepName}
          stepName={stepName}
          stepStatus={stepValue.status}
          stepMessage={stepValue.message}
        />
      ))

    return (
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
          sx={{
            backgroundColor: '#888',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            pl: 0
          }}
        >
          {' '}
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

  // Handle the case where bilbomdStep is undefined or null
  return <Item>No steps available</Item>
}

export default BilboMDNerscSteps
