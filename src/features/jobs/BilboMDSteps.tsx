import { BilboMDJob } from 'types/interfaces'
import BilboMDStep from './BilboMDStep'
import { Chip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Item from 'themes/components/Item'

interface BilboMDStepsProps {
  job: BilboMDJob
}

const BilboMDSteps = ({ job }: BilboMDStepsProps) => {
  let stepsToHide: string[] = []
  if (job.mongo.__t === 'BilboMdScoper') {
    stepsToHide = ['reduce', 'rnaview', 'kgs', 'IonNet', 'foxs', 'multifoxs']
  } else {
    stepsToHide = ['reduce', 'rnaview', 'kgs', 'IonNet']
  }

  const { bilbomdStep } = job.bullmq
  // Check if bilbomdStep is defined and not null before using Object.entries
  if (bilbomdStep && typeof bilbomdStep === 'object') {
    return (
      <Item>
        <Grid container>
          {Object.entries(bilbomdStep)
            .filter(([stepName]) => !stepsToHide.includes(stepName))
            .map(([stepName, stepValue]) => (
              <BilboMDStep
                key={stepName}
                stepName={stepName}
                stepStatus={String(stepValue)}
              />
            ))}
          <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 1 }}>
              <b>INFO: </b>
            </Typography>
            <Chip label={job.bullmq.bilbomdLastStep} size='small' />
          </Grid>
        </Grid>
      </Item>
    )
  }

  // Handle the case where bilbomdStep is undefined or null
  return <Item>No steps available</Item>
}

export default BilboMDSteps
