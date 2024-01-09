import { useParams } from 'react-router-dom'
import { useGetJobByIdQuery } from './jobsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import { Button, Grid, Typography, Alert } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { axiosInstance } from 'app/api/axios'
import MissingJob from 'components/MissingJob'
// import { BilboMDJob } from 'types/interfaces'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import BilboMDSteps from './BilboMDSteps'
import BilboMDScoperSteps from './BilboMDScoperSteps'
import HeaderBox from 'components/HeaderBox'
import JobError from './JobError'
import JobDBDetails from './JobDBDetails'
import MolstarViewer from 'features/molstar/Viewer'

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
  // const { job, isLoading } = useGetJobsQuery('jobsList', {
  //   pollingInterval: 30000,
  //   refetchOnFocus: true,
  //   refetchOnMountOrArgChange: true,
  //   selectFromResult: ({ data, isLoading }) =>
  //     ({ job: data?.find((job) => job.mongo.id === id), isLoading }) as {
  //       job: BilboMDJob
  //       isLoading: boolean
  //     }
  // })
  // console.log('SingleJobPage job: ', job)
  // if (isLoading) {
  //   return <PulseLoader color={'#FFF'} />
  // }
  const {
    data: job,
    isLoading,
    isError
  } = useGetJobByIdQuery(id, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // if (process.env.NODE_ENV === 'development') {
  //   console.log('SingleJobPage job -->', job)
  // }

  if (isLoading) {
    return <PulseLoader color={'#FFF'} />
  }

  if (isError) {
    return <div>Error loading job.</div>
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
            <BilboMDSteps job={job} />
          </Grid>
        ) : null}

        {job.scoper ? (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Scoper Status</Typography>
            </HeaderBox>
            <BilboMDScoperSteps job={job} />
          </Grid>
        ) : null}

        <JobDBDetails job={job} />

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

        {job.mongo.status === 'Completed' && job.scoper && (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Molstar Viewer</Typography>
            </HeaderBox>
            <MolstarViewer jobId={job.mongo.id} foxsBest={job.scoper.FoXSTopFile} />
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
