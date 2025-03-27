import { Alert, Chip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Grid from '@mui/material/Grid'

interface PlddtSliderProps {
  setFieldValue: (
    field: string,
    value: number | number[],
    shouldValidate?: boolean
  ) => void
  value: number
}

function valuetext(value: number) {
  return `${value}`
}

export default function PlddtSlider({
  setFieldValue,
  value
}: PlddtSliderProps) {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    const valueToSet = Array.isArray(newValue) ? newValue[0] : newValue

    setFieldValue('plddt_cutoff', valueToSet)
  }

  return (
    <Box sx={{ width: 420, mt: 4 }}>
      <Typography sx={{ mb: 1 }}>
        Select <b>pLDDT</b> cutoff value (default is 50)
      </Typography>
      <Grid container spacing={2} alignItems='center'>
        <Grid>
          <Chip
            label={value}
            variant='outlined'
            color='success'
            sx={{
              width: 60, // Set a fixed width
              justifyContent: 'center' // Center the label
            }}
          />
        </Grid>
        <Grid sx={{ flex: 1 }}>
          <Slider
            value={value}
            valueLabelFormat={valuetext}
            getAriaValueText={valuetext}
            step={1}
            min={10}
            max={98}
            valueLabelDisplay='auto'
            onChange={handleChange}
            track={false}
          />
        </Grid>
        <Alert severity='info'>
          The pLDDT cutoff value is used to determine if a rigid domain
          determined from the PAE matrix should be included in the{' '}
          <b>const.inp</b> file. A <b>lower</b> pLDDT cutoff will result in more
          rigid domains. A <b>higher</b> pLDDT cutoff will result in fewer rigid
          domains.
        </Alert>
      </Grid>
    </Box>
  )
}
