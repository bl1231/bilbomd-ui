import { Alert, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'

interface PAESliderProps {
  setFieldValue: (
    field: string,
    value: number | number[],
    shouldValidate?: boolean
  ) => void
  value: number
}

const marks = [
  {
    value: 1.5,
    label: '1.5'
  },
  {
    value: 2.0,
    label: '2'
  },
  {
    value: 3.0,
    label: '3'
  },
  {
    value: 4.0,
    label: '4'
  },
  {
    value: 5.0,
    label: '5'
  },
  {
    value: 6.0,
    label: '6'
  },
  {
    value: 7.0,
    label: '7'
  },
  {
    value: 8.0,
    label: '8'
  },
  {
    value: 9.0,
    label: '9'
  },
  {
    value: 10.0,
    label: '10'
  }
]

function valuetext(value: number) {
  return `${value}`
}

export default function PAESlider({ setFieldValue, value }: PAESliderProps) {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    const valueToSet = Array.isArray(newValue) ? newValue[0] : newValue

    setFieldValue('pae_power', valueToSet)
  }

  return (
    <Box sx={{ width: 420, mt: 4 }}>
      <Typography sx={{ mb: 1 }}>
        Select Leiden <b>Clustering Weight</b> (default is 2)
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
            step={null}
            min={1.0}
            max={10.5}
            marks={marks}
            valueLabelDisplay='auto'
            onChange={handleChange}
            track={false}
          />
        </Grid>
      </Grid>
      <Alert severity='info'>
        A smaller weight will result in fewer clusters (i.e. rigid shapes).
        <br />A larger weight will result in more clusters.
        <br />
        CHARMM allows a maximum of 20 <code>shape</code> definitions.
        <br /> If <b>PAE Jiffy</b>
        {'\u2122'} produces more than 20 please re-run with a lower weight.
      </Alert>
    </Box>
  )
}
