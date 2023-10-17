import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
// import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
// import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'
import { Chip, Grid } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

interface BilboMDStepProps {
  stepName: string
  stepStatus: string
}
const BilboMDStep = ({ stepName, stepStatus }: BilboMDStepProps) => {
  const getTooltipMessage = (stepName) => {
    if (stepName === 'pae') {
      return 'In this step the PAE matrix from Alphafold is used to define rigid bodies and rigid domains of your molecule.'
    } else if (stepName === 'autorg') {
      return 'In this step we use BioXTAS to determine the Radius of gyration for your SAXS data.'
    } else if (stepName === 'minimize') {
      return 'In this step we use CHARMM minimize the relax the model geometry.'
    } else if (stepName === 'heat') {
      return 'In this step we use CHARMM to heat and then cool your model.'
    } else if (stepName === 'md') {
      return 'In this step we use CHARMM molecular dynamics to generate possible model conformations.'
    } else if (stepName === 'foxs') {
      return 'In this step we use FoXS to calculate SAXS scattering curves from MD models.'
    } else if (stepName === 'multifoxs') {
      return 'In this step we use MultiFoXS to determine the best FoXS curves to match your experimental SAXS data.'
    } else if (stepName === 'results') {
      return 'In this step we are gathering the results together and creating a file for you to download.'
    } else if (stepName === 'email') {
      return 'In this step we send an email to let you know the BilboMD job is complete.'
    }
    return ''
  }
  const tooltipMessage = getTooltipMessage(stepName)
  return (
    <Grid key={stepName} sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
      <Tooltip title={tooltipMessage} arrow>
        {stepStatus === 'no' ? (
          <Chip icon={<RadioButtonUncheckedIcon />} size="small" label={stepName} />
        ) : stepStatus === 'start' ? (
          <Chip
            icon={<DirectionsRunRoundedIcon />}
            size="small"
            label={stepName}
            style={{ backgroundColor: '#fff566' }}
          />
        ) : stepStatus === 'end' ? (
          <Chip
            icon={<CheckCircleIcon />}
            size="small"
            label={stepName}
            color="success"
          />
        ) : (
          <div>nope</div>
        )}
      </Tooltip>
    </Grid>
  )
}

export default BilboMDStep
