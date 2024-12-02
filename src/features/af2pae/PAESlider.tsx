import { useEffect } from 'react'
import { Alert, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

interface PAESliderProps {
  setFieldValue: (
    field: string,
    value: number | number[],
    shouldValidate?: boolean
  ) => void
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

export default function PAESlider({ setFieldValue }: PAESliderProps) {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    // Update the 'pae_power' field value in Formik 'values' object
    setFieldValue('pae_power', newValue)
  }
  useEffect(() => {
    // Set the default value when the component mounts
    setFieldValue('pae_power', 2.0)
  }, [setFieldValue])
  return (
    <Box sx={{ width: 420, mt: 2 }}>
      <Typography sx={{ mb: 1 }}>
        Select Leiden <b>Clustering Weight</b> (default is 2.0)
      </Typography>
      <Slider
        aria-label='Restricted values'
        defaultValue={2.0}
        valueLabelFormat={valuetext}
        getAriaValueText={valuetext}
        step={null}
        min={1.0}
        max={10.5}
        marks={marks}
        valueLabelDisplay='auto'
        onChange={handleChange}
      />
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
