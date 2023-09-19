import { useParams } from 'react-router-dom'
import { useGetJobsQuery } from './jobsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import {
  Button,
  Divider,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
// import { Box } from '@mui/system'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import axiosInstance, { AxiosResponse } from 'app/api/axios'
import { format } from 'date-fns'
import MissingJob from 'components/MissingJob'
import { Job } from 'types/interfaces'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import BilboMDSteps from './BilboMDSteps'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
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
  const token = useSelector(selectCurrentToken)
  const { id } = useParams()

  // Will select the job with the given id, and will only rerender if the given jobs data changes
  const { job } = useGetJobsQuery('jobsList', {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    selectFromResult: ({ data }) =>
      ({ job: data?.find((job) => job.id === id) }) as { job: Job }
  })
  // console.log(job)
  if (!job) {
    console.log('no job with id: ', id)
    return <PulseLoader color={'#FFF'} />
  }

  const handleDownload = async (id: string) => {
    try {
      const response: AxiosResponse<Blob> = await axiosInstance.get(
        `jobs/${id}/results`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

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

  const getStatusBackgroundColor = (status) => {
    // Define the background colors based on status values
    const statusColors = {
      Submitted: '#d6e4ff',
      Pending: '#d6e4ff',
      Running: '#fff566',
      Completed: '#73d13d',
      Error: 'red'
    }
    return statusColors[status]
  }

  const statusBGColor = getStatusBackgroundColor(job.status)

  const content = job ? (
    <>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <Typography sx={HeaderThingee}>JOB TITLE</Typography>
          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.title}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={HeaderThingee}>STATUS</Typography>
          <Item sx={{ backgroundColor: statusBGColor }}>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.status}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={HeaderThingee}>PROGRESS</Typography>
          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.bullmq.progress} %
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>BILBOMD STEPS</Typography>
          <BilboMDSteps job={job.bullmq} />
        </Grid>

        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              // aria-controls="panel1a-content"
              // id="panel1a-header"
              sx={{
                backgroundColor: '#888',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                pl: 1,
                m: 0
              }}
            >
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  letterSpacing: '1px'
                }}
              >
                Job Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Item>
                <Grid container>
                  <Grid item xs={1}>
                    <Typography>
                      <b>Submitted: </b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ ml: 1 }}>
                      {format(new Date(job.time_submitted), 'MM/dd/yyyy HH:mm:ss')}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>
                      <b>Started: </b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ ml: 1 }}>
                      {job.time_started
                        ? format(new Date(job.time_started), 'MM/dd/yyyy HH:mm:ss')
                        : job.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>
                      <b>Completed: </b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ ml: 1 }}>
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
            </AccordionDetails>
          </Accordion>
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
  ) : (
    <MissingJob id={id} />
  )

  return content
}

export default SingleJobPage
