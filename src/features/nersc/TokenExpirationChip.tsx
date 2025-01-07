import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import {
  formatDistanceToNow,
  isBefore,
  subDays,
  subWeeks,
  format
} from 'date-fns'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const TokenExpirationChip = () => {
  const now = new Date()
  const { data, error, isLoading } = useGetConfigsQuery('configData')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading configuration data</div>

  // Check if data is undefined
  if (!data) return <div>No configuration data available</div>

  const expirationDate = new Date(data?.tokenExpires)

  let chipColor = 'green'
  let chipLabel = `Expires in ${formatDistanceToNow(expirationDate)}`
  //
  // isBefore   Is the first date before the second one?
  //
  if (isBefore(expirationDate, now)) {
    console.log('Expired Condition Met')
    chipColor = 'red'
    chipLabel = 'Expired'
  } else {
    const twoDaysBeforeExp = subDays(expirationDate, 2)
    const oneWeekBeforeExp = subWeeks(expirationDate, 1)

    // console.log('Two Days Before EXP:', twoDaysBeforeExp)
    // console.log('One Week Before EXP:', oneWeekBeforeExp)

    if (!isBefore(now, twoDaysBeforeExp)) {
      // console.log('Within 2 Days Condition Met')
      chipColor = 'darkorange' // dark orange
    } else if (!isBefore(now, oneWeekBeforeExp)) {
      // console.log('Within 1 Week Condition Met')
      chipColor = 'orange' // orange
    } else {
      // console.log('More than 1 Week Condition Met')
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
          {format(expirationDate.toLocaleString(), 'MMMM d, yyyy h:mm a')}
        </span>
      </Typography>
    </Grid>
  )
}

export default TokenExpirationChip
