import { Grid, Typography, Paper } from '@mui/material'
import SystemStatuses from './SystemStatuses'
import ProjectHours from './ProjectHours'
import TokenExpirationChip from './TokenExpirationChip'
import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const NerscStatusList = () => {
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})
  if (configIsLoading) return <div>Loading config data...</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  // Ensure useNersc is a boolean
  const useNersc = config.useNersc?.toLowerCase() === 'true'
  // Provide a default project code if none is set
  const nerscProjCode = config.nerscProjCode || 'm4659'

  const content = (
    <>
      <HeaderBox>
        <Typography>NERSC Status</Typography>
      </HeaderBox>
      <Item sx={{ p: 1 }}>
        <Grid container spacing={1} direction='column'>
          <Grid item sx={{ m: 1, display: 'flex' }}>
            <SystemStatuses />
          </Grid>
          {useNersc && (
            <>
              <Grid item sx={{ mx: 0.5, display: 'flex' }}>
                <TokenExpirationChip />
              </Grid>
              <Grid item sx={{ mx: 0.5, display: 'flex' }}>
                <ProjectHours projectCode={nerscProjCode} />
              </Grid>
            </>
          )}
        </Grid>
      </Item>
    </>
  )

  return content
}

export default NerscStatusList
