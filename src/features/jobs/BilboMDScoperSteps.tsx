import { BilboMDJob } from 'types/interfaces'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
// import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
// import BilboMDStep from './BilboMDStep'
import { Alert, Chip, Grid } from '@mui/material'
import BilboMDScoperStep from './BilboMDScoperStep'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface BilboMDStepsProps {
  job: BilboMDJob
}

const BilboMDScoperSteps = ({ job }: BilboMDStepsProps) => {
  // const stepsToHide = ['scoper', 'results', 'email']
  const stepsToShow = ['reduce', 'rnaview', 'kgs', 'foxs', 'IonNet', 'multifoxs']

  if (job.scoper && typeof job.scoper === 'object') {
    return (
      <Item>
        {/* <Alert severity="warning">Scoper status is a work in progress</Alert> */}

        <Grid container>
          {Object.entries(job.scoper)
            .filter(([stepName]) => stepsToShow.includes(stepName))
            .map(([stepName, stepValue]) => (
              <BilboMDScoperStep
                key={stepName}
                stepName={stepName}
                stepStatus={String(stepValue)}
              />
            ))}
        </Grid>
      </Item>
    )
  }

  return <Item>No steps available</Item>
}

const BilboMDScoperStepsV2 = ({ job }: BilboMDStepsProps) => {
  // const stepsToHide = ['scoper', 'results', 'email', 'FoXSProgress'] // Replace with actual step names to hide

  if (job.scoper && typeof job.scoper === 'object') {
    return (
      <Item>
        <Alert severity="warning">Scoper status is a work in progress</Alert>

        <Grid container spacing={1}>
          <Grid sx={{ m: 0.5, display: 'flex', alignItems: 'center' }}>
            <Chip size="small" label="reduce" />
            <Chip size="small" label="RNAview" />
            <Chip size="small" label="KGS" />
          </Grid>
        </Grid>
      </Item>
    )
  }

  return <Item>No steps available</Item>
}

export { BilboMDScoperSteps, BilboMDScoperStepsV2 }
