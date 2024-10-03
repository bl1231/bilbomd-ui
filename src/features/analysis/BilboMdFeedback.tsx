import { Chip, Divider, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid2'
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
    mw_saxs: 67.08,
    mw_model: 68.78,
    mw_err: 0.0,
    overall_chi_square: 2.22,
    q_ranges: [0.011985, 0.1, 0.2, 0.499587],
    chi_squares_of_regions: [1.84, 2.5, 2.25],
    residuals_of_regions: [-0.07, 0.098, -0.017],
    mw_feedback:
      'The difference between the model MW (68.775) and the SAXS MW (67.075) is 2.5%, within acceptable error (< 10.0%)',
    overall_chi_square_feedback:
      "The overall chi-square of this fit is 2.22. Moderate. You are getting there, so let's try to improve it.",
    highest_chi_square_report:
      'The chi-square is highest (2.5) in the region where (0.1 < q < 0.2).',
    second_highest_cs_report:
      'The chi-square is also high (2) in the region where 0.2 < q < 0.5.',
    regional_chi_square_feedback:
      'Flexibility of elongated regions must be increased, but you are close to a good fit. Try adjusting the flexible regions in the const.inp file. Buffer subtraction problems may have also occured.'
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
      return { sx: { backgroundColor: 'red' } }
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
              The best Chi<sup>2</sup> is
              <Chip
                label={report.overall_chi_square}
                sx={{ mx: 1, fontSize: '1.2em', backgroundColor: '#999' }}
              />
            </Typography>
          </Grid>
          <Grid>
            <Typography sx={{ fontSize: '1.3em' }}>
              Experimental MW:
              <Chip
                label={report.mw_saxs}
                sx={{ mx: 1, fontSize: '1.2em', backgroundColor: '#999' }}
              />
              kDa
            </Typography>
          </Grid>
          <Grid>
            <Typography sx={{ fontSize: '1.3em' }}>
              Model MW:
              <Chip
                label={report.mw_model}
                sx={{ mx: 1, fontSize: '1.2em', backgroundColor: '#999' }}
              />
              kDa
            </Typography>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        hi
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
              label={report.chi_squares_of_regions[0]}
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
              label={report.chi_squares_of_regions[1]}
              // {...getChipProps(report.chi_squares_of_regions[1])}
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
              label={report.chi_squares_of_regions[2]}
              // {...getChipProps(report.chi_squares_of_regions[2])}
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
            {report.highest_chi_square_report}
          </Typography>
          <Typography sx={{ mb: 1, fontSize: '1.2em' }}>
            {report.second_highest_cs_report}
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
