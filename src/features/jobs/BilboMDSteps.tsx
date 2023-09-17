import { BullMQJob } from 'types/interfaces'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import BilboMDStep from './BilboMDStep'
import { Chip, Grid, Typography } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface BilboMDStepsProps {
  job: BullMQJob
}

const BilboMDSteps = ({ job }: BilboMDStepsProps) => {
  const { bilbomdStep } = job
  // Check if bilbomdStep is defined and not null before using Object.entries
  if (bilbomdStep && typeof bilbomdStep === 'object') {
    return (
      <Item>
        <Grid container>
          {Object.entries(bilbomdStep).map(([stepName, stepValue]) => (
            <BilboMDStep key={stepName} stepName={stepName} stepStatus={stepValue} />
          ))}
          <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 1 }}>
              <b>INFO: </b>
            </Typography>
            <Chip label={job.bilbomdLastStep} size="small" />
          </Grid>
        </Grid>
      </Item>
    )
  }

  // Handle the case where bilbomdStep is undefined or null
  return <Item>No steps available</Item>
}

export default BilboMDSteps
