import { useEffect } from 'react'
import { Typography, Chip, Slider } from '@mui/material'
import Grid from '@mui/material/Grid'
import { NewSANSJobFormValues } from 'types/sansForm'

interface FormikErrors {
  [key: string]: string | undefined
}

interface FormikTouched {
  [key: string]: boolean | undefined
}

interface ChainDeuterationSliderProps {
  chainIds: string[]
  values: NewSANSJobFormValues
  errors: FormikErrors
  touched: FormikTouched
  isSubmitting: boolean
  setFieldValue: (
    field: string,
    value: number,
    shouldValidate?: boolean | undefined
  ) => void
}

const ChainDeuterationSlider: React.FC<ChainDeuterationSliderProps> = ({
  chainIds,
  values,
  isSubmitting,
  setFieldValue
}) => {
  useEffect(() => {
    chainIds.forEach((chainId) => {
      const fieldName =
        `deuteration_fraction_${chainId}` as keyof NewSANSJobFormValues
      if (values[fieldName] === undefined) {
        setFieldValue(fieldName, 0)
      }
    })
  }, [chainIds, setFieldValue, values])

  return (
    <>
      {chainIds.map((chainId) => (
        <Grid key={chainId} sx={{ my: 2, width: '520px' }}>
          <Typography
            id={`deuteration-fraction-slider-${chainId}`}
            gutterBottom
          >
            Deuteration Fraction for Chain {chainId}
          </Typography>
          <Grid container spacing={2} alignItems='center'>
            <Grid>
              <Chip
                label={`${values[`deuteration_fraction_${chainId}`] || 0}%`}
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
                aria-labelledby={`deuteration-fraction-slider-${chainId}`}
                name={`deuteration_fraction_${chainId}`}
                value={values[`deuteration_fraction_${chainId}`] || 0}
                onChange={(_event, value) => {
                  setFieldValue(
                    `deuteration_fraction_${chainId}`,
                    Array.isArray(value) ? value[0] : value
                  )
                }}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay='off'
                disabled={isSubmitting}
                track={false}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </>
  )
}

export default ChainDeuterationSlider
