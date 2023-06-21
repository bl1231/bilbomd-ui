import { useParams } from 'react-router-dom'
import { useGetJobsQuery } from './jobsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import { Button, Divider, Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import axios, { AxiosResponse } from 'app/api/axios'
import { format } from 'date-fns'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px'
}

const SingleJobPage = () => {
  useTitle('BilboMD: Job Details')

  const { id } = useParams()

  // Will select the job with the given id, and will only rerender if the given jobs data changes
  const { job } = useGetJobsQuery('jobsList', {
    selectFromResult: ({ data }) => ({ job: data?.find((job) => job.id === id) })
  })

  if (!job) return <PulseLoader color={'#FFF'} />

  const handleDownload = async (id: string) => {
    try {
      const response: AxiosResponse<Blob> = await axios.get(`jobs/${id}/results`, {
        responseType: 'blob'
      })

      if (response.data) {
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'results.tar.gz')
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
      } else {
        console.error('No data')
      }
    } catch (error) {
      console.error('Download results.tar.gz error:', error)
    }
  }

  const content = (
    <>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={9}>
          <Typography sx={HeaderThingee}>JOB TITLE</Typography>
          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.title}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={HeaderThingee}>STATUS</Typography>
          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.status}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>DETAILS</Typography>
          <Item>
            <Grid container>
              <Grid item xs={1}>
                <Typography>
                  <b>Time Submitted:</b>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {format(new Date(job.time_submitted), 'MM/dd/yyyy HH:mm:ss')}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>
                  <b>Time Started:</b>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {job.time_started
                    ? format(new Date(job.time_started), 'MM/dd/yyyy HH:mm:ss')
                    : job.status}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>
                  <b>Time Completed:</b>{' '}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {job.time_completed
                    ? format(new Date(job.time_completed), 'MM/dd/yyyy HH:mm:ss')
                    : job.status}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            <Typography sx={{ ml: 1 }}>
              <b>data:</b> {job.data_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>psf_file:</b> {job.psf_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>crd_file:</b> {job.crd_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>const_inp_file:</b> {job.const_inp_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>rg_min:</b> {job.rg_min}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>rg_max:</b> {job.rg_max}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ ml: 1 }}>
              <b>ID:</b> {job.id}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>UUID:</b> {job.uuid}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>RESULTS</Typography>
          <Item>
            {job.status === 'Completed' ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleDownload(job.id)
                }}
                sx={{ my: 2 }}
              >
                Download Results
              </Button>
            ) : (
              <Typography variant="h5" sx={{ m: 1 }}>
                Pending...
              </Typography>
            )}
          </Item>
        </Grid>
      </Grid>
    </>
  )

  return content
}

export default SingleJobPage
