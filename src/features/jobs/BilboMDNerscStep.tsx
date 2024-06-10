import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'
import ErrorIcon from '@mui/icons-material/Error'
import { Chip, Grid, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

interface BilboMDStepProps {
  stepName: string
  stepStatus: string
  stepMessage: string
}
const BilboMDNerscStep = ({
  stepName,
  stepStatus,
  stepMessage
}: BilboMDStepProps) => {
  // const theme = useTheme()

  const getTooltipMessage = (stepName: string) => {
    if (stepName === 'scoper') {
      return 'In this step we run Scoper. Details are below.'
    } else if (stepName === 'pae') {
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
  console.log(stepName, stepStatus, stepMessage)
  return (
    <Grid key={stepName} sx={{ m: 0.5, display: 'flex', alignItems: 'center' }}>
      <Tooltip title={tooltipMessage} arrow>
        <>
          <Grid item>
            <Chip
              icon={
                stepStatus === 'Waiting' ? (
                  <RadioButtonUncheckedIcon />
                ) : stepStatus === 'Running' ? (
                  <DirectionsRunRoundedIcon style={{ color: 'black' }} />
                ) : stepStatus === 'Success' ? (
                  <CheckCircleIcon />
                ) : stepStatus === 'Error' ? (
                  <ErrorIcon />
                ) : undefined
              }
              size='small'
              label={stepName}
              color={
                stepStatus === 'Success'
                  ? 'success'
                  : stepStatus === 'Error'
                    ? 'error'
                    : undefined
              }
              style={
                stepStatus === 'Running'
                  ? { backgroundColor: '#fff566', color: 'black' }
                  : undefined
              }
            />
          </Grid>
          <Grid item>
            <Typography variant='body2' sx={{ ml: 1 }}>
              {stepMessage || 'No additional information'}
            </Typography>
          </Grid>
        </>
      </Tooltip>
    </Grid>
  )
}

export default BilboMDNerscStep
