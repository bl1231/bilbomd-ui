import { useEffect } from 'react'
import { Box, Typography, Chip, Slider } from '@mui/material'
import Grid from '@mui/material/Grid2'

interface DeuterationValues {
  [key: string]: number
}

interface FormikErrors {
  [key: string]: string | undefined
}

interface FormikTouched {
  [key: string]: boolean | undefined
}

interface DynamicChainSlidersProps {
  chainIds: string[]
  values: DeuterationValues
  errors: FormikErrors
  touched: FormikTouched
  isSubmitting: boolean
  setFieldValue: (
    field: string,
    value: number,
    shouldValidate?: boolean | undefined
  ) => void
}

const DynamicChainSliders: React.FC<DynamicChainSlidersProps> = ({
  chainIds,
  values,
  errors,
  touched,
  isSubmitting,
  setFieldValue
}) => {
  useEffect(() => {
    chainIds.forEach((chainId) => {
      const fieldName = `deuteration_fraction_${chainId}`
      if (values[fieldName] === undefined) {
        setFieldValue(fieldName, 0)
      }
    })
  }, [chainIds, setFieldValue, values])

  return (
    <>
      {chainIds.map((chainId) => (
        <Grid key={chainId} sx={{ my: 2, width: '520px' }}>
          <Box display='flex' alignItems='center'>
            <Typography
              id={`deuteration-fraction-slider-${chainId}`}
              gutterBottom
            >
              Deuteration Fraction for Chain {chainId}
            </Typography>
            <Chip
              label={`${values[`deuteration_fraction_${chainId}`] || 0}%`}
              sx={{ ml: 2 }}
            />
          </Box>
          <Slider
            aria-labelledby={`deuteration-fraction-slider-${chainId}`}
            name={`deuteration_fraction_${chainId}`}
            value={values[`deuteration_fraction_${chainId}`] || 0}
            onChange={(event, value) => {
              setFieldValue(
                `deuteration_fraction_${chainId}`,
                Array.isArray(value) ? value[0] : value
              )
            }}
            min={0}
            max={100}
            step={1}
            marks
            valueLabelDisplay='off'
            disabled={isSubmitting}
          />
          {errors[`deuteration_fraction_${chainId}`] &&
          touched[`deuteration_fraction_${chainId}`] ? (
            <Typography color='error'>
              {errors[`deuteration_fraction_${chainId}`]}
            </Typography>
          ) : null}
        </Grid>
      ))}
    </>
  )
}

export default DynamicChainSliders
