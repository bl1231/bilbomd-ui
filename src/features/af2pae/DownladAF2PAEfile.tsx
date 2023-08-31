import { Button, Grid } from '@mui/material'
import { Box } from '@mui/system'

interface DownloadProps {
  uuid: string | null
  constfile: string | null
}

const Download = ({ constfile, uuid }: DownloadProps) => {
  const handleDownload = () => {
    if (constfile) {
      const link = document.createElement('a')
      link.href = `af2pae/${uuid}`
      link.setAttribute('download', 'const.inp')
      document.body.appendChild(link)
      link.click()
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
      console.log('uuid: ', uuid)
      console.log('constfile: ', constfile)
      console.log('link ', link)
    }
  }

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 50%',
        mx: 1
      }}
    >
      <Grid
        item
        sx={{
          display: 'flex',
          alignSelf: 'start'
        }}
      >
        <Button variant="contained" type="button" onClick={handleDownload}>
          Download
        </Button>
      </Grid>
    </Box>
  )

  return content
}

export default Download
