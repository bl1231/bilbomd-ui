import { Typography, Link } from '@mui/material'

const AdditionalInfo = () => (
  <Typography variant='body1' sx={{ my: 3 }}>
    We are continually and actively developing <b>BilboMD</b> and would
    appreciate you testing and reporting your experience. Feel free to add an
    issue on the{' '}
    <Link
      href='https://github.com/bl1231/bilbomd-ui'
      target='_blank'
      rel='noopener noreferrer'
    >
      <b>bilbomd-ui</b>
    </Link>{' '}
    GitHub repository.
  </Typography>
)

export default AdditionalInfo
