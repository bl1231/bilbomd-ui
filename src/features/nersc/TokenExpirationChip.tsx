import { useState, useEffect } from 'react'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { formatDistanceToNow, isBefore, subDays, subWeeks } from 'date-fns'
import { useGetConfigsQuery } from './configsApiSlice'

const TokenExpirationChip = () => {
  const [now, setNow] = useState(new Date())
  const { data, error, isLoading } = useGetConfigsQuery({})

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading configuration data</div>

  // Check if data is undefined
  if (!data) return <div>No configuration data available</div>

  // console.log('Component Rendered')
  // console.log('Data:', data)

  const expirationDate = new Date(data?.tokenExpires)
  // console.log('Parsed Expiration Date:', expirationDate)
  // console.log('Current Date:', now)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setNow(new Date())
  //     console.log('Updated Current Date:', new Date())
  //   }, 1000 * 10) // Update every minute

  //   return () => clearInterval(interval) // Cleanup interval on component unmount
  // }, [])

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

  // console.log('Final Chip Color:', chipColor)
  // console.log('Final Chip Label:', chipLabel)

  return (
    <Grid sx={{ m: 0, display: 'flex', alignItems: 'center' }}>
      <Typography>
        <b>Superfacility API Token</b>:
      </Typography>
      <Chip
        sx={{ mx: 1 }}
        label={chipLabel}
        style={{ backgroundColor: chipColor, color: 'white' }}
      />
      <Typography>
        <b>Expires</b>: {expirationDate.toLocaleString()}
      </Typography>
    </Grid>
  )
}

export default TokenExpirationChip
