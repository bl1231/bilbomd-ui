import { useGetNerscStatusQuery } from './nerscApiSlice'
import { CircularProgress, Alert, AlertTitle } from '@mui/material'
import NerscStatusChip from './NerscStatusChip'
type ContentType = React.ReactNode | string
const SystemStatuses = () => {
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
      <>
        {nerscStatuses
          ?.filter((system) => systemsOfInterest.includes(system.name))
          .map((system) => (
            <NerscStatusChip key={system.name} system={system} />
          ))}
      </>
    )
  }
  return content
}

export default SystemStatuses
