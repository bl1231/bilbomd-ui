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
  AccordionDetails,
  Alert
} from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { axiosInstance } from 'app/api/axios'
import { format } from 'date-fns'
import MissingJob from 'components/MissingJob'
import { BilboMDJob } from 'types/interfaces'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import BilboMDSteps from './BilboMDSteps'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HeaderBox from 'components/HeaderBox'
// import { useState } from 'react'
import { Box } from '@mui/system'
import JobError from './JobError'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const SingleJobPage = () => {
  useTitle('BilboMD: Job Details')
  // const [logContent, setLogContent] = useState('')
  const token = useSelector(selectCurrentToken)
  const { id } = useParams()

  // Will select the job with the given id, and will only rerender if the given jobs data changes
  const { job, isLoading } = useGetJobsQuery('jobsList', {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    selectFromResult: ({ data, isLoading }) =>
      ({ job: data?.find((job) => job.mongo.id === id), isLoading }) as {
        job: BilboMDJob
        isLoading: boolean
      }
  })

  if (isLoading) {
    return <PulseLoader color={'#FFF'} />
  }

  const handleDownload = async (id: string) => {
    try {
      const response = await axiosInstance.get(`jobs/${id}/results`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  const getStatusBackgroundColor = (status) => {
    const statusColors = {
      Submitted: '#d6e4ff',
      Pending: '#d6e4ff',
      Running: '#fff566',
      Completed: '#73d13d',
      Error: 'red'
    }

    // Check if status is defined and exists in the statusColors object
    if (status in statusColors) {
      return statusColors[status]
    }
    return '#d6e4ff'
  }

  const statusBGColor = getStatusBackgroundColor(job?.mongo.status)

  const content = job ? (
    <>
      {/* {console.log('Job--->', job)} */}
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <HeaderBox sx={{ py: '6px' }}>
            <Typography>Job Title</Typography>
          </HeaderBox>

          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.mongo.title}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <HeaderBox sx={{ py: '6px' }}>
            <Typography>Status</Typography>
          </HeaderBox>
          <Item sx={{ backgroundColor: statusBGColor }}>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.mongo.status}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <HeaderBox sx={{ py: '6px' }}>
            <Typography>Progress</Typography>
          </HeaderBox>
          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.bullmq?.bullmq?.progress ?? 'n/a'} %
            </Typography>
          </Item>
        </Grid>

        {job.bullmq ? (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>BilboMD Steps</Typography>
            </HeaderBox>
            <BilboMDSteps job={job.bullmq} />
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{
                backgroundColor: '#888',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                pl: 0
              }}
            >
              <HeaderBox sx={{ py: 0 }}>
                <Typography>Job Details</Typography>
              </HeaderBox>
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
                      {format(new Date(job.mongo.time_submitted), 'MM/dd/yyyy HH:mm:ss')}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>
                      <b>Started: </b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ ml: 1 }}>
                      {job.mongo.time_started
                        ? format(new Date(job.mongo.time_started), 'MM/dd/yyyy HH:mm:ss')
                        : job.mongo.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>
                      <b>Completed: </b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ ml: 1 }}>
                      {job.mongo.time_completed
                        ? format(
                            new Date(job.mongo.time_completed),
                            'MM/dd/yyyy HH:mm:ss'
                          )
                        : job.mongo.status}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box padding={2}>
                      {/* <Typography sx={{ ml: 1 }}>
                        <b>type:</b> {job.bullmq.bullmq.data.type}
                      </Typography> */}
                      <Typography sx={{ ml: 1 }}>
                        <b>data:</b> {job.mongo.data_file}
                      </Typography>
                      <Typography sx={{ ml: 1 }}>
                        <b>psf_file:</b> {job.mongo.psf_file}
                      </Typography>
                      <Typography sx={{ ml: 1 }}>
                        <b>crd_file:</b> {job.mongo.crd_file}
                      </Typography>
                      <Typography sx={{ ml: 1 }}>
                        <b>const_inp_file:</b> {job.mongo.const_inp_file}
                      </Typography>
                      <Typography sx={{ ml: 1 }}>
                        <b>rg_min:</b> {job.mongo.rg_min}
                      </Typography>
                      <Typography sx={{ ml: 1 }}>
                        <b>rg_max:</b> {job.mongo.rg_max}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box padding={2}>
                      {/* Content for the right box */}
                      <Typography>BullMQ Logs to go here</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ ml: 1 }}>
                  <b>ID:</b> {job.mongo.id}
                </Typography>
                <Typography sx={{ ml: 1 }}>
                  <b>UUID:</b> {job.mongo.uuid}
                </Typography>
              </Item>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {job.mongo.status === 'Completed' && (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Results</Typography>
            </HeaderBox>
            <Item>
              <Button
                variant="contained"
                onClick={() => {
                  handleDownload(job.mongo.id)
                }}
                sx={{ my: 2 }}
              >
                Download Results
              </Button>
            </Item>
          </Grid>
        )}
        {job.mongo.status === 'Error' && (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Error - {job.bullmq.bullmq.failedReason}</Typography>
            </HeaderBox>

            <Item>
              <Alert severity="error" variant="outlined">
                Please scroll to the bottom of the log file to see why this step failed.
              </Alert>
              <JobError job={job} />
            </Item>
          </Grid>
        )}
      </Grid>
    </>
  ) : (
    <>
      <MissingJob id={id} />
    </>
  )

  return content
}

export default SingleJobPage
