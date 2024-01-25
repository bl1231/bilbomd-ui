import { Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { version } from '../../../../package.json'

const Footer = () => {
  return (
    <Paper
      sx={{
        marginTop: 'calc(10% + 60px)',
        width: '100%',
        position: 'fixed',
        bottom: 0
      }}
      component="footer"
      square
      variant="outlined"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            my: 1
          }}
        >
          {/* <div>
            <Image priority src="/Logo.svg" width={75} height={30} alt="Logo" />
          </div> */}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            mb: 2
          }}
        >
          <Typography variant="caption">
            Copyright ©2023. SIBYLS Beamline - BilboMD v{version}
          </Typography>
        </Box>
      </Container>
    </Paper>
  )
}

export default Footer
