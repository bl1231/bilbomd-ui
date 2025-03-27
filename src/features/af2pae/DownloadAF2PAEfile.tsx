import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/system'
import { axiosInstance } from 'app/api/axios'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../../slices/authSlice'

interface DownloadProps {
  uuid: string | null
}

const Download = ({ uuid }: DownloadProps) => {
  const token = useSelector(selectCurrentToken)
  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`af2pae?uuid=${uuid}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data) {
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'const.inp')
        document.body.appendChild(link)
        link.click()
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
        console.log('uuid: ', uuid)
        console.log('link ', link)
      }
    } catch (error) {
      console.error('Download results.tar.gz error:', error)
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
          alignSelf: 'start'
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
