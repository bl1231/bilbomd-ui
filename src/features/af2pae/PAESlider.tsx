import { useEffect } from 'react'
import { Alert, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

const marks = [
  {
    value: 1.5,
    label: '1.5'
  },
  {
    value: 2.0,
    label: '2.0'
  },
  {
    value: 5.0,
    label: '5.0'
  },
  {
    value: 10.0,
    label: '10.0'
  }
]

function valuetext(value: number) {
  return `${value}`
}

export default function PAESlider({ setFieldValue }) {
  const handleChange = (event, newValue) => {
    // Update the 'pae_power' field value in Formik 'values' object
    setFieldValue('pae_power', newValue)
  }
  useEffect(() => {
    // Set the default value when the component mounts
    setFieldValue('pae_power', 2.0)
  }, [setFieldValue])
  return (
    <Box sx={{ width: 400, mt: 2 }}>
      <Typography sx={{ mb: 1 }}>
        Select Leiden Clustering weight value (default is 2.0)
      </Typography>
      <Slider
        aria-label='Restricted values'
        defaultValue={2.0}
        valueLabelFormat={valuetext}
        getAriaValueText={valuetext}
        step={null}
        min={1.0}
        max={10.5}
        valueLabelDisplay='auto'
        marks={marks}
        onChange={handleChange}
      />
      <Alert severity='info'>
        Smaller values will result in fewer clusters.
        <br /> Larger values will result in more clusters.
      </Alert>
    </Box>
  )
}
