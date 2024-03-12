import { useGetNerscStatusQuery } from './nerscApiSlice'
import { CircularProgress, Alert } from '@mui/material'
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
    content = <Alert>Error loading NERSC Status.{error.toString()}</Alert>
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
