import { Grid, Typography, Paper, Alert } from '@mui/material'
import SystemStatuses from './SystemStatuses'
import ProjectHours from './ProjectHours'

import HeaderBox from 'components/HeaderBox'
import { styled } from '@mui/material/styles'
const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))
// console.log('USE_NERSC: ', import.meta.env.VITE_USE_NERSC)
const NerscStatusList = () => {
  const useNersc = import.meta.env.VITE_USE_NERSC === 'true'
  const content = (
    <>
      <HeaderBox>
        <Typography>NERSC Status</Typography>
      </HeaderBox>
      <Item sx={{ p: 1 }}>
        <Grid container spacing={1} direction='column'>
          <Grid item>
            <Alert severity='info' color='warning'>
              Jobs are not currently being run on NERSC systems.
            </Alert>
          </Grid>
          <Grid item sx={{ display: 'flex' }}>
            <SystemStatuses />
          </Grid>
          {useNersc && (
            <Grid item sx={{ display: 'flex' }}>
              <ProjectHours projectCode={'m4521'} />
            </Grid>
          )}
        </Grid>
      </Item>
    </>
  )

  return content
}

export default NerscStatusList
