import { Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { version } from '../../../../package.json'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const gitHash = import.meta.env.VITE_GIT_HASH
  // console.log(import.meta.env)
  // console.log('gitHash is: ', gitHash)
  return (
    <Paper
      sx={{
        marginTop: 'calc(10% + 60px)',
        width: '110%',
        position: 'fixed',
        bottom: 0
      }}
      // component="footer"
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
          <Typography variant='caption'>
            Copyright ©{currentYear}. SIBYLS Beamline - BilboMD v{version}-
            {gitHash}
          </Typography>
        </Box>
      </Container>
    </Paper>
  )
}

export default Footer
