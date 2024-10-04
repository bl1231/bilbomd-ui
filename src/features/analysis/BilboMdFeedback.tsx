import { Chip, Divider, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid2'
import FeedbackChart from './FeedbackChart'

// import CheckCircleIcon from '@mui/icons-material/CheckCircle'
// import WarningIcon from '@mui/icons-material/Warning'
// import ErrorIcon from '@mui/icons-material/Error'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const BilboMdFeedback = () => {
  const report = {
    mw_saxs: 36.9,
    mw_model: 36.9,
    mw_err: 0.01,
    overall_chi_square: 1.13,
    q_ranges: [0.011428, 0.1, 0.2, 0.40267],
    chi_squares_of_regions: [1.22, 1.7, 0.8],
    residuals_of_regions: [-0.056, 0.433, -0.155],
    mw_feedback:
      'The difference between the model MW (36.9) and the SAXS MW (36.9) is within acceptable error (0.0%).',
    overall_chi_square_feedback:
      'The overall chi-square of this fit is 1.13. Moderate.',
    highest_chi_square_feedback:
      'The chi-square is highest (1.7) in the region where 0.1 < q < 0.2, but this is okay.',
    second_highest_chi_square_feedback:
      'The 2nd highest chi-square (1.22) is in the region where 0.01 < q < 0.1, but this is okay.',
    regional_chi_square_feedback:
      'The model has a low chi-square throughout all q-ranges and is a good fit overall.'
  }

  const getChipProps = (value: number) => {
    // console.log('value:', value)
    if (value < 1.2) {
      return { sx: { backgroundColor: 'green' } }
    } else if (value >= 1.2 && value <= 2.0) {
      return { sx: { backgroundColor: '#59a14f' } }
    } else if (value >= 2.0 && value <= 3.0) {
      return { sx: { backgroundColor: '#bdbf20' } }
    } else {
      return { sx: { backgroundColor: '#f44336' } }
    }
  }

  const getChi2ChipBackgroundColor = (overallChiSquare: number): string => {
    if (overallChiSquare < 1.0) {
      return 'green' // Green for values less than 1.0
    } else if (overallChiSquare >= 1.0 && overallChiSquare < 2.0) {
      return '#59a14f' // Yellow for values between 1.0 and 2.0
    } else if (overallChiSquare >= 2.0 && overallChiSquare < 3.0) {
      return '#bdbf20' // Orange for values between 2.0 and 3.0
    } else {
      return '#f44336' // Red for values 3.0 and above
    }
  }

  const getMWChipBackgroundColor = (mwError: number): string => {
    if (mwError < 0.06) {
      return 'green'
    } else if (mwError >= 0.06 && mwError < 0.1) {
      return '#bdbf20'
    } else {
      return '#f44336' // Red for values 3.0 and above
    }
  }

  return (
    <Item>
      <Grid
        container
        spacing={2}
        sx={{ m: 1, display: 'flex', alignItems: 'center' }}
      >
        <Grid size={{ xs: 10 }}>
          <Typography sx={{ fontSize: '1.7em' }}>
            SAXS Model Analysis Report
          </Typography>
        </Grid>
        {/* Best Chi-Square and Multi-State Info */}
        <Grid container sx={{ my: 0.5 }}>
          <Grid>
            <Typography sx={{ fontSize: '1.3em' }}>
              Overall Chi<sup>2</sup> :
              <Chip
                label={report.overall_chi_square.toFixed(2)}
                sx={{
                  mx: 1,
                  fontSize: '1.2em',
                  backgroundColor: getChi2ChipBackgroundColor(
                    report.overall_chi_square
                  )
                }}
              />
            </Typography>
          </Grid>
          <Grid>
            <Typography sx={{ fontSize: '1.3em' }}>
              Experimental MW:
              <Chip
                label={report.mw_saxs.toFixed(1)}
                sx={{
                  mx: 1,
                  fontSize: '1.2em',
                  backgroundColor: getMWChipBackgroundColor(report.mw_err)
                }}
              />
              kDa
            </Typography>
          </Grid>
          <Grid>
            <Typography sx={{ fontSize: '1.3em' }}>
              Model MW:
              <Chip
                label={report.mw_model.toFixed(1)}
                sx={{
                  mx: 1,
                  fontSize: '1.2em',
                  backgroundColor: getMWChipBackgroundColor(report.mw_err)
                }}
              />
              kDa
            </Typography>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <FeedbackChart
          data={{
            q_ranges: report.q_ranges,
            chi_squares_of_regions: report.chi_squares_of_regions,
            residuals_of_regions: report.residuals_of_regions
          }}
        />
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        {/* Chi-Squares for Regions */}
        <Grid size={{ xs: 6 }}>
          <Typography sx={{ mb: 2, fontSize: '1.7em' }}>
            Chi<sup>2</sup> Values for Regions
          </Typography>

          {/* Chi-Square for 0.01 < q < 0.1 */}
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            sx={{ my: 0.5 }}
            width='55%'
          >
            <Typography>
              Chi<sup>2</sup> for 0.01 &lt; q &lt; 0.1:
            </Typography>
            <Chip
              sx={{
                fontSize: '1.2em',
                width: '100px',
                ...(getChipProps(report.chi_squares_of_regions[0]).sx || {})
              }}
              label={report.chi_squares_of_regions[0].toFixed(2)}
            />
          </Grid>

          {/* Chi-Square for 0.1 < q < 0.2 */}
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            sx={{ my: 0.5 }}
            width='55%'
          >
            <Typography>
              Chi<sup>2</sup> for 0.1 &lt; q &lt; 0.2:
            </Typography>
            <Chip
              sx={{
                fontSize: '1.2em',
                width: '100px',
                ...(getChipProps(report.chi_squares_of_regions[1]).sx || {})
              }}
              label={report.chi_squares_of_regions[1].toFixed(2)}
            />
          </Grid>

          {/* Chi-Square for 0.2 < q < 0.5 */}
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            sx={{ my: 0.5 }}
            width='55%'
          >
            <Typography>
              Chi<sup>2</sup> for 0.2 &lt; q &lt; 0.5:
            </Typography>
            <Chip
              sx={{
                fontSize: '1.2em',
                width: '100px',
                ...(getChipProps(report.chi_squares_of_regions[2]).sx || {})
              }}
              label={report.chi_squares_of_regions[2].toFixed(2)}
            />
          </Grid>
        </Grid>
        {/* Residuals of Regions */}
        <Grid size={{ xs: 6 }}>
          <Typography sx={{ mb: 2, fontSize: '1.7em' }}>
            Mean Residuals of Regions
          </Typography>

          {/* Chi-Square for 0.01 < q < 0.1 */}
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            sx={{ my: 0.5 }}
            width='68%'
          >
            <Typography>Mean residuals of 0.01 &lt; q &lt; 0.1:</Typography>
            <Chip
              sx={{
                fontSize: '1.2em',
                width: '100px'
              }}
              label={report.residuals_of_regions[0].toFixed(2)}
            />
          </Grid>

          {/* Chi-Square for 0.1 < q < 0.2 */}
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            sx={{ my: 0.5 }}
            width='68%'
          >
            <Typography>Mean residuals of 0.1 &lt; q &lt; 0.2:</Typography>
            <Chip
              sx={{
                fontSize: '1.2em',
                width: '100px'
              }}
              label={report.residuals_of_regions[1].toFixed(2)}
            />
          </Grid>

          {/* Chi-Square for 0.2 < q < 0.5 */}
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            sx={{ my: 0.5 }}
            width='68%'
          >
            <Typography>Mean residuals of 0.2 &lt; q &lt; 0.5:</Typography>
            <Chip
              sx={{
                fontSize: '1.2em',
                width: '100px'
              }}
              label={report.residuals_of_regions[2].toFixed(2)}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        {/* Feedback Reports */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1, fontSize: '1.2em' }}>
            {report.highest_chi_square_feedback}
          </Typography>
          <Typography sx={{ mb: 1, fontSize: '1.2em' }}>
            {report.second_highest_chi_square_feedback}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        {/* Feedback and Suggestions */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ fontSize: '1.7em' }}>Summary Feedback</Typography>
          <Typography sx={{ m: 1 }}>{report.mw_feedback}</Typography>
          <Typography sx={{ m: 1 }}>
            {report.overall_chi_square_feedback}
          </Typography>
          <Typography sx={{ m: 1 }}>
            {report.regional_chi_square_feedback}
          </Typography>
        </Grid>
      </Grid>
    </Item>
  )
}

export default BilboMdFeedback
