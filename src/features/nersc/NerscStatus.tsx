import { Divider, Typography, Paper } from '@mui/material'
import Grid from '@mui/material/Grid2'
import NerscSystemStatuses from './SystemStatuses'
import ProjectHours from './ProjectHours'
import TokenExpirationChip from './TokenExpirationChip'
import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useGetNerscOutagesQuery } from 'slices/nerscApiSlice'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const NerscStatusList = () => {
  const {
    data: outages
    // error: outagesError,
    // isLoading: outagesIsLoading
  } = useGetNerscOutagesQuery()
  console.log('outages:', outages)
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})
  if (configIsLoading) return <div>Loading config data...</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  // Ensure useNersc is a boolean
  // const useNersc = config.useNersc?.toLowerCase() === 'true'
  // Provide a default project code if none is set
  const nerscProjCode = config.nerscProjCode || 'm4659'

  const content = (
    <>
      <HeaderBox>
        <Typography>NERSC Status</Typography>
      </HeaderBox>
      <Item sx={{ p: 2 }}>
        <Grid container spacing={1} direction='column'>
          <NerscSystemStatuses />
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
