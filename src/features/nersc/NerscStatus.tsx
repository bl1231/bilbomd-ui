import { Grid, Typography, Paper } from '@mui/material'
import SystemStatuses from './SystemStatuses'
import ProjectHours from './ProjectHours'

import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'

const useNersc = import.meta.env.VITE_USE_NERSC === 'true'
const nerscProjCode = import.meta.env.VITE_NERSC_PROJ || ''

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const NerscStatusList = () => {
  // console.log('useNersc: ', useNersc)
  const content = (
    <>
      <HeaderBox>
        <Typography>NERSC Status</Typography>
      </HeaderBox>
      <Item sx={{ p: 1 }}>
        <Grid container spacing={1} direction='column'>
          <Grid item></Grid>
          <Grid item sx={{ display: 'flex' }}>
            <SystemStatuses />
          </Grid>
          {useNersc && (
            <Grid item sx={{ display: 'flex' }}>
              <ProjectHours projectCode={nerscProjCode} />
            </Grid>
          )}
        </Grid>
      </Item>
    </>
  )

  return content
}

export default NerscStatusList
