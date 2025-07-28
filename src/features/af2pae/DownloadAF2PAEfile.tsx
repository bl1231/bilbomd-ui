import { useState } from 'react'
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
  const [downloading, setDownloading] = useState(false)
  const handleDownload = async () => {
    const start = Date.now()
    setDownloading(true)
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
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download const.inp error:', error)
    } finally {
      const elapsed = Date.now() - start
      const delay = Math.max(0, 1000 - elapsed)
      setTimeout(() => setDownloading(false), delay)
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
        <Button
          variant='contained'
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Downloading...' : 'Download'}
        </Button>
      </Grid>
    </Box>
  )

  return content
}

export default Download
