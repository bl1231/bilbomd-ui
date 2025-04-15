import { Paper, Typography, Link } from '@mui/material'
import { Box, Container } from '@mui/system'
import { version } from '../../../../package.json'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { blue } from '@mui/material/colors'
// import { useTheme } from '@mui/material/styles'

const Footer = () => {
  // const theme = useTheme()
  const currentYear = new Date().getFullYear()
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData')
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
          <Typography sx={{ wordBreak: 'break-all' }}>
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
          <Typography sx={{ wordBreak: 'break-all' }}>
            <Link
              href='https://github.com/bl1231/bilbomd-ui'
              target='_blank'
              rel='noopener noreferrer'
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 2,
                fontWeight: 'bold'
              }}
            >
              <img
                src='/github-mark.svg'
                alt='GitHub Repository'
                width='20'
                height='20'
                style={{
                  backgroundColor: blue[500],
                  borderRadius: '10px',
                  marginRight: '2px'
                }}
              />
              GitHub
            </Link>
          </Typography>
        </Box>
      </Container>
    </Paper>
  )
}

export default Footer
