import { useGetNerscStatusQuery } from 'slices/nerscApiSlice'
import { CircularProgress, Alert, AlertTitle, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import NerscStatusChip from './NerscStatusChip'
type ContentType = React.ReactNode | string
const NerscSystemStatuses = () => {
  const {
    data: nerscStatuses,
    isSuccess,
    error,
    isLoading
  } = useGetNerscStatusQuery()
  let content: ContentType
  if (isLoading) content = <CircularProgress />

  if (error) {
    console.log('err:', error)
    content = (
      <Alert>
        <AlertTitle>Error loading NERSC Status.</AlertTitle>
        {JSON.stringify(error)}
      </Alert>
    )
  }
  const systemsOfInterest = [
    'perlmutter',
    'spin',
    'ldap',
    'iris',
    'community_filesystem'
  ]
  if (isSuccess) {
    content = (
      <Grid sx={{ mx: 1, display: 'flex', alignItems: 'center' }}>
        {nerscStatuses
          ?.filter((system) => systemsOfInterest.includes(system.name))
          .map((system) => (
            <NerscStatusChip key={system.name} system={system} />
          ))}
        <Typography sx={{ ml: 2 }}>
          (mouseover the status chips for details)
        </Typography>
      </Grid>
    )
  }
  return content
}

export default NerscSystemStatuses
