import { BilboMDJob } from 'types/interfaces'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
// import BilboMDStep from './BilboMDStep'
import { Chip, Grid, Typography } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface BilboMDStepsProps {
  job: BilboMDJob
}

const BilboMDScoperSteps = ({ job }: BilboMDStepsProps) => {
  if (job.scoper && typeof job.scoper === 'object') {
    return (
      <Item>
        <Typography>Scoper status is a work in progress</Typography>
        <Grid container spacing={1}>
          {Object.entries(job.scoper).map(([stepName, stepValue]) => (
            <Grid item key={stepName}>
              <Chip
                size="small"
                label={
                  typeof stepValue === 'boolean'
                    ? `${stepName}`
                    : `${stepName}: ${stepValue}`
                }
                icon={
                  typeof stepValue === 'boolean' ? (
                    stepValue ? (
                      <CheckCircleIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )
                  ) : undefined
                }
                color={
                  typeof stepValue === 'boolean'
                    ? stepValue
                      ? 'success'
                      : undefined
                    : undefined
                }
              />
            </Grid>
          ))}
        </Grid>
      </Item>
    )
  }

  return <Item>No steps available</Item>
}

export default BilboMDScoperSteps
