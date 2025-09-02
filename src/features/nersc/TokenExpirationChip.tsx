import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  formatDistanceToNow,
  isBefore,
  subDays,
  subWeeks,
  format
} from 'date-fns'
import { parseDateSafe } from 'utils/dates'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const TokenExpirationChip = () => {
  const now = new Date()
  const { data, error, isLoading } = useGetConfigsQuery('configData')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading configuration data</div>

  // Check if data is undefined
  if (!data) return <div>No configuration data available</div>

  const expirationDate = parseDateSafe(data?.tokenExpires)

  let chipColor = 'green'
  let chipLabel = ''

  if (!expirationDate) {
    chipColor = 'gray'
    chipLabel = 'Expires: unknown'
  } else {
    chipLabel = `Expires in ${formatDistanceToNow(expirationDate)}`

    if (isBefore(expirationDate, now)) {
      chipColor = 'red'
      chipLabel = 'Expired'
    } else {
      const twoDaysBeforeExp = subDays(expirationDate, 2)
      const oneWeekBeforeExp = subWeeks(expirationDate, 1)

      if (!isBefore(now, twoDaysBeforeExp)) {
        chipColor = 'darkorange' // within 2 days
      } else if (!isBefore(now, oneWeekBeforeExp)) {
        chipColor = 'orange' // within 1 week
      }
    }
  }

  return (
    <Grid sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
      <Typography>
        <b>Superfacility API Token</b>:
      </Typography>
      <Chip
        sx={{ mx: 1 }}
        label={chipLabel}
        style={{ backgroundColor: chipColor, color: 'white' }}
      />
      <Typography>
        <b>Expiration Date :</b>{' '}
        <span style={{ fontSize: '1.0rem' }}>
          {expirationDate
            ? format(expirationDate, 'MMMM d, yyyy h:mm a')
            : 'Unknown'}
        </span>
      </Typography>
    </Grid>
  )
}

export default TokenExpirationChip
