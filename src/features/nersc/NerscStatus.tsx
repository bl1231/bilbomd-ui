import { useState } from 'react'
import { Alert, Divider, Typography, Paper, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid2'
import NerscSystemStatuses from './SystemStatuses'
import ProjectHours from './ProjectHours'
import TokenExpirationChip from './TokenExpirationChip'
import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useGetNerscOutagesQuery } from 'slices/nerscApiSlice'
import { differenceInDays, parseISO, format } from 'date-fns'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const NerscStatusList = () => {
  const [showAlert, setShowAlert] = useState(true)
  const {
    data: outages
    // error: outagesError,
    // isLoading: outagesIsLoading
  } = useGetNerscOutagesQuery()
  // console.log('outages:', outages)
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('ConfigData')
  if (configIsLoading) return <div>Loading config data...</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  // Ensure useNersc is a boolean
  // const useNersc = config.useNersc?.toLowerCase() === 'true'
  // Provide a default project code if none is set
  const nerscProjCode = config.nerscProjCode || 'm4659'
  // Calculate the soonest outage within the next 60 days
  const now = new Date()
  const upcomingOutage = outages
    ?.filter((outage) => {
      const outageStartDate = parseISO(outage.start_at)
      const daysUntilOutage = differenceInDays(outageStartDate, now)
      return daysUntilOutage >= 0 && daysUntilOutage <= 30
    })
    ?.sort(
      (a, b) => parseISO(a.start_at).getTime() - parseISO(b.start_at).getTime()
    )[0] // Get the soonest outage
  const handleCloseAlert = () => {
    setShowAlert(false)
  }
  const content = (
    <>
      <HeaderBox>
        <Typography>NERSC Status</Typography>
      </HeaderBox>
      <Item sx={{ p: 2 }}>
        <Grid container spacing={1} direction='column'>
          <NerscSystemStatuses />
          {showAlert && upcomingOutage && (
            <Alert
              severity='info'
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={handleCloseAlert}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              <Typography>
                The next scheduled outage for <b>Perlmutter</b> is coming up
                soon:
              </Typography>
              <Typography>
                <b>Start:</b>{' '}
                {format(
                  parseISO(upcomingOutage.start_at),
                  'MMMM d, yyyy h:mm a'
                )}{' '}
                to <b>End:</b>{' '}
                {format(parseISO(upcomingOutage.end_at), 'MMMM d, yyyy h:mm a')}
              </Typography>
            </Alert>
          )}
          <Divider sx={{ my: 1 }} />
          <TokenExpirationChip />
          <ProjectHours projectCode={nerscProjCode} />
        </Grid>
      </Item>
    </>
  )

  return content
}

export default NerscStatusList
