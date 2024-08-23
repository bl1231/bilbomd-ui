import { Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { version } from '../../../../package.json'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})
  if (configIsLoading) return <div>Loading config data...</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  const gitHash = config.gitHash || ''

  return (
    <Paper
      sx={{
        marginTop: 'calc(10% + 60px)',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0
      }}
      square
      variant='outlined'
    >
      <Container fixed>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            my: 1
          }}
        ></Box>

        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            mb: 2
          }}
        >
          <Typography variant='caption' sx={{ wordBreak: 'break-all' }}>
            Copyright ©{currentYear}. SIBYLS Beamline - BilboMD v{version}{' '}
            {gitHash}
          </Typography>
        </Box>
      </Container>
    </Paper>
  )
}

export default Footer
