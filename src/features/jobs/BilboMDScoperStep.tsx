import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
// import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
// import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded'
import ErrorIcon from '@mui/icons-material/Error'
import { Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

import Tooltip from '@mui/material/Tooltip'

interface BilboMDScoperStepProps {
  stepName: string
  stepStatus: string
}
const BilboMDScoperStep = ({
  stepName,
  stepStatus
}: BilboMDScoperStepProps) => {
  const getTooltipMessage = (stepName) => {
    if (stepName === 'reduce') {
      return 'In this step Hydrogen atoms are added to your RNA molecule.'
    } else if (stepName === 'rnaview') {
      return 'In this step we use RNAView to determine the basepairs in your RNA molecule.'
    } else if (stepName === 'kgs') {
      return 'In this step we use run KGS (Kino-Geometric Sampling) to generate an ensemble of 1000 possible conformations of your RNA molecule.'
    } else if (stepName === 'foxs') {
      return 'In this step we use FoXS to calculate theoretical SAXS scattering curves from each KGS model.'
    } else if (stepName === 'IonNet') {
      return 'In this step we use the IonNet nueral network to create predictions of Mg ion locations for the best scoring KGS model.'
    } else if (stepName === 'multifoxs') {
      return 'In this step we use MultiFoXS to determine the best constellation of Mg ions and RNA that match your experimental SAXS data.'
    } else if (stepName === 'results') {
      return 'In this step we are gathering the results together and creating a file for you to download.'
    } else if (stepName === 'email') {
      return 'In this step we send an email to let you know the BilboMD job is complete.'
    }
    return ''
  }
  const tooltipMessage = getTooltipMessage(stepName)
  return (
    <>
      {['no', 'start', 'end', 'error'].includes(stepStatus) ? (
        <Grid
          key={stepName}
          sx={{ m: 0.5, display: 'flex', alignItems: 'center' }}
        >
          <Tooltip title={tooltipMessage} arrow>
            {stepStatus === 'no' ? (
              <Chip
                icon={<RadioButtonUncheckedIcon />}
                size='small'
                label={stepName}
              />
            ) : stepStatus === 'start' ? (
              <Chip
                icon={<DirectionsRunRoundedIcon style={{ color: 'black' }} />}
                size='small'
                label={stepName}
                style={{ backgroundColor: '#fff566', color: 'black' }}
              />
            ) : stepStatus === 'end' ? (
              <Chip
                icon={<CheckCircleIcon />}
                size='small'
                label={stepName}
                color='success'
              />
            ) : stepStatus === 'error' ? (
              <Chip
                icon={<ErrorIcon />}
                size='small'
                label={stepName}
                color='error'
              />
            ) : (
              <div>nonono</div>
            )}
          </Tooltip>
        </Grid>
      ) : null}
    </>
  )
}

export default BilboMDScoperStep
