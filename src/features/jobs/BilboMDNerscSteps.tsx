import { BilboMDJob } from 'types/interfaces'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import BilboMDNerscStep from './BilboMDNerscStep'
import { Chip, Grid, Typography } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface BilboMDStepsProps {
  job: BilboMDJob
}

const BilboMDNerscSteps = ({ job }: BilboMDStepsProps) => {
  let stepsToHide: string[] = []
  if (job.mongo.__t === 'BilboMdCRD') {
    stepsToHide = ['autorg', 'pdb2crd', 'pae']
  } else if (job.mongo.__t === 'BilboMdAuto') {
    stepsToHide = ['autorg']
  } else if (job.mongo.__t === 'BilboMdPDB') {
    stepsToHide = ['autorg', 'pae']
  }

  const { steps } = job.mongo
  // Check if bilbomdStep is defined and not null before using Object.entries
  if (steps && typeof steps === 'object') {
    return (
      <Item>
        <Grid container sx={{ flexDirection: 'column' }}>
          {Object.entries(steps)
            .filter(([stepName]) => !stepsToHide.includes(stepName))
            .map(([stepName, stepValue]) => (
              <BilboMDNerscStep
                key={stepName}
                stepName={stepName}
                stepStatus={stepValue.status}
                stepMessage={stepValue.message}
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

export default BilboMDNerscSteps
