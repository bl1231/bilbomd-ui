import { Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Box } from '@mui/system'

interface DownloadProps {
  file: Blob | null
}

const Download = ({ file }: DownloadProps) => {
  const handleDownload = () => {
    if (file) {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(file)
      link.setAttribute('download', 'const.inp')
      document.body.appendChild(link)
      link.click()
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
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
        sx={{
          display: 'flex',
          alignSelf: 'end'
        }}
      >
        <Button variant='contained' type='button' onClick={handleDownload}>
          Download
        </Button>
      </Grid>
    </Box>
  )

  return content
}

export default Download
