import { Paper, Typography, Link } from '@mui/material'
import { Box, Container } from '@mui/system'
import { version } from '../../../../package.json'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
// import { useTheme } from '@mui/material/styles'

const Footer = () => {
  // const theme = useTheme()
  const currentYear = new Date().getFullYear()
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})
  if (configIsLoading) return <div>Loading config data...</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>
  const gitHash = config.uiGitHash || ''

  return (
    <Paper className='footer-paper' square variant='outlined'>
      <Container fixed>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            my: 0.5
          }}
        >
          <Typography
            variant='caption'
            sx={{ wordBreak: 'break-all', fontSize: '0.875rem' }}
          >
            &quot;dynamicity... the essence of BilboMD&quot;
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            mb: 1
          }}
        >
          <Typography variant='caption' sx={{ wordBreak: 'break-all' }}>
            Copyright ©{currentYear}.{' '}
            <Link
              href='https://bl1231.als.lbl.gov'
              target='_blank'
              rel='noopener noreferrer'
              sx={{ fontWeight: 'bold' }}
            >
              SIBYLS Beamline
            </Link>{' '}
            - BilboMD v{version}-{gitHash}
          </Typography>
        </Box>
      </Container>
    </Paper>
  )
}

export default Footer
