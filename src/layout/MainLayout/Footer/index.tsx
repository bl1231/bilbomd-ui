import { Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'

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
          <Typography variant="caption" color="initial">
            Copyright ©2023. SIBYLS Beamline
          </Typography>
        </Box>
      </Container>
    </Paper>
  )
}

export default Footer
