import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import { Chip, Grid } from '@mui/material'

interface BilboMDStepProps {
  stepName: string
  stepStatus: string
}
const BilboMDStep = ({ stepName, stepStatus }: BilboMDStepProps) => {
  return (
    <Grid key={stepName} sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
      {stepStatus === 'no' ? (
        <Chip icon={<RadioButtonUncheckedIcon />} size="small" label={stepName} />
      ) : stepStatus === 'start' ? (
        <Chip
          icon={<CachedOutlinedIcon />}
          size="small"
          label={stepName}
          style={{ backgroundColor: '#fff566' }}
        />
      ) : stepStatus === 'end' ? (
        <Chip icon={<CheckCircleIcon />} size="small" label={stepName} color="success" />
      ) : (
        <div>nope</div>
      )}
    </Grid>
  )
}

export default BilboMDStep
