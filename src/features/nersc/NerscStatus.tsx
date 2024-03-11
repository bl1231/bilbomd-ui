import { useGetNerscStatusQuery } from './nerscApiSlice'
import { Grid, Typography, Paper, CircularProgress, Alert } from '@mui/material'
// import Divider from '@mui/material/Divider'
import NerscStatusChip from './NerscStatusChip'
import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'
const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

type ContentType = React.ReactNode | string

const NerscStatusList = () => {
  const {
    data: nerscStatuses,
    isSuccess,
    error,
    isLoading
  } = useGetNerscStatusQuery()
  // console.log('nerscStatuses:', nerscStatuses)
  let content: ContentType
  if (isLoading) content = <CircularProgress />

  if (error) {
    console.log('err:', error)
    content = (
      <Alert>Error loading BullMQ Queue Status.{error.toString()}</Alert>
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
        <HeaderBox>
          <Typography>NERSC Status</Typography>
        </HeaderBox>
        <Item sx={{ p: 1 }}>
          <Grid container>
            <Grid item sx={{ display: 'flex' }}>
              {nerscStatuses
                ?.filter((system) => systemsOfInterest.includes(system.name))
                .map((system) => (
                  <NerscStatusChip key={system.name} system={system} />
                ))}
            </Grid>
          </Grid>
        </Item>
      </>
    )
  }
  return content
}

export default NerscStatusList
