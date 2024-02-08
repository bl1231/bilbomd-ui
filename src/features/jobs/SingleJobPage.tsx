import { useParams } from 'react-router-dom'
import { useGetJobByIdQuery } from './jobsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import { Button, Grid, Typography, Alert } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import { styled, useTheme } from '@mui/material/styles'
import { axiosInstance } from 'app/api/axios'
import MissingJob from 'components/MissingJob'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import BilboMDSteps from './BilboMDSteps'
import { BilboMDScoperSteps } from './BilboMDScoperSteps'
import HeaderBox from 'components/HeaderBox'
import JobError from './JobError'
import JobDBDetails from './JobDBDetails'
import MolstarViewer from 'features/molstar/Viewer'
import { BilboMDScoperTable } from '../scoperjob/BilboMDScoperTable'
import ScoperFoXSAnalysis from 'features/scoperjob/ScoperFoXSAnalysis'
import FoXSAnalysis from './FoXSAnalysis'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const SingleJobPage = () => {
  useTitle('BilboMD: Job Details')
  const theme = useTheme()
  const token = useSelector(selectCurrentToken)
  const { id } = useParams()

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
    return <PulseLoader color={'#ffffff'} />
  }

  if (isError) {
    return (
      <Alert severity="error" variant="outlined">
        Error loading job.
      </Alert>
    )
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

  const getStatusColors = (status, theme) => {
    const statusColors = {
      Submitted: {
        background: '#d6e4ff',
        text: theme.palette.mode === 'light' ? 'black' : 'white'
      },
      Pending: {
        background: '#d6e4ff',
        text: theme.palette.mode === 'light' ? 'black' : 'white'
      },
      Running: {
        background: '#fff566',
        text: theme.palette.mode === 'light' ? 'black' : 'black'
      },
      Completed: {
        background: '#73d13d',
        text: theme.palette.mode === 'light' ? 'black' : 'black'
      },
      Error: {
        background: 'red',
        text: 'white'
      }
    }

    // Check if status is defined and exists in the statusColors object
    if (status in statusColors) {
      return statusColors[status]
    }

    // Default background and text colors
    return {
      background: '#d6e4ff',
      text: theme.palette.mode === 'light' ? 'black' : 'white'
    }
  }

  const statusColors = getStatusColors(job?.mongo.status, theme)

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
          <Item
            sx={{
              backgroundColor: statusColors.background,
              color: statusColors.text
            }}
          >
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.mongo.status}
            </Typography>
          </Item>
        </Grid>

        <Grid item xs={3}>
          <HeaderBox sx={{ py: '6px' }}>
            <Typography>Progress</Typography>
          </HeaderBox>
          <Item sx={{ display: 'flex', alignItems: 'center' }}>
            <LinearProgress
              variant="determinate"
              value={parseFloat(job.bullmq?.bullmq?.progress ?? '0')}
              sx={{ flexGrow: 1 }}
            />
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.bullmq?.bullmq?.progress ?? 'n/a'} %
            </Typography>
          </Item>
        </Grid>

        {job.bullmq ? (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Steps</Typography>
            </HeaderBox>
            <BilboMDSteps job={job} />
          </Grid>
        ) : null}

        {job.scoper && (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Scoper Details</Typography>
            </HeaderBox>
            <BilboMDScoperSteps job={job} />
            <BilboMDScoperTable scoper={job.scoper} />
          </Grid>
        )}

        <JobDBDetails job={job} />

        {job.mongo.status === 'Completed' && job.scoper && id && (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Scoper FoXS Analysis</Typography>
            </HeaderBox>
            <ScoperFoXSAnalysis id={id} />
          </Grid>
        )}

        {job.mongo.status === 'Completed' && (job.classic || job.auto) && id && (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>BilboMD FoXS Analysis</Typography>
            </HeaderBox>
            <FoXSAnalysis id={id} />
          </Grid>
        )}

        {job.mongo.status === 'Completed' && (
          <Grid item xs={12}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Molstar Viewer</Typography>
            </HeaderBox>
            <MolstarViewer job={job} />
          </Grid>
        )}

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
                Download
              </Button>
              <Typography>
                The{' '}
                <span style={{ fontWeight: 'bold', fontFamily: 'Courier, monospace' }}>
                  results.tar.gz
                </span>{' '}
                will contains your original files plus some output files from Scoper.
              </Typography>
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
                Hmmmm... Well something didn&apos;t work. Please try submitting again and
                if things still don&apos;t work contact Scott or Michal.
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
