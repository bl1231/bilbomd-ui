import BilboMDNerscStep from './BilboMDNerscStep'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HeaderBox from 'components/HeaderBox'
import { IBilboMDSteps } from '@bl1231/bilbomd-mongodb-schema'

interface BilboMDMongoStepsProps {
  steps: IBilboMDSteps
}

const BilboMDMongoSteps: React.FC<BilboMDMongoStepsProps> = ({ steps }) => {
  // console.log('BilboMDMongoSteps: steps:', steps)
  let stepsToHide: string[] = []
  stepsToHide = ['_id']

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

  // Convert steps into an array of step entries
  const bilboMdSteps = Object.entries(steps)
    .filter(([stepName]) => !stepsToHide.includes(stepName))
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

  // Find the latest message from the steps
  const latestStepMessage = Object.entries(steps).reduce(
    (latestMessage, [, stepValue]) => {
      return stepValue.message || latestMessage // Find the latest available message
    },
    ''
  )

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        sx={{
          backgroundColor: '#888',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          pl: 1
        }}
      >
        <HeaderBox sx={{ py: 0 }}>
          <Typography>BilboMD Steps</Typography>
        </HeaderBox>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container sx={{ flexDirection: 'column' }}>
          {bilboMdSteps}

          {latestStepMessage && (
            <Chip
              label={latestStepMessage}
              variant='filled'
              sx={{
                mt: 2,
                fontSize: '1.5em',
                backgroundColor: 'green',
                color: 'white',
                width: 'auto'
              }}
            />
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default BilboMDMongoSteps
