import { useParams } from 'react-router'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import {
  Button,
  Typography,
  Alert,
  AlertTitle,
  Box,
  CircularProgress
} from '@mui/material'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import { styled, useTheme, Theme } from '@mui/material/styles'
import { axiosInstance } from 'app/api/axios'
import MissingJob from 'components/MissingJob'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
// import BilboMDSteps from './BilboMDSteps'
import BilboMDNerscSteps from './BilboMDNerscSteps'
import BilboMDMongoSteps from './BilboMDMongoSteps'
import { BilboMDScoperSteps } from './BilboMDScoperSteps'
import HeaderBox from 'components/HeaderBox'
import JobError from './JobError'
import JobDBDetails from './JobDBDetails'
import MultiMDJobDBDetails from 'features/multimd/MultiMDJobDBDetails'
import MolstarViewer from 'features/molstar/Viewer'
import { BilboMDScoperTable } from '../scoperjob/BilboMDScoperTable'
import ScoperFoXSAnalysis from 'features/scoperjob/ScoperFoXSAnalysis'
import FoXSAnalysis from './FoXSAnalysis'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useGetJobByIdQuery } from 'slices/jobsApiSlice'
import BilboMdFeedback from 'features/analysis/BilboMdFeedback'
import { BilboMDJob, BilboMDMultiJob } from 'types/interfaces'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

type JobStatus = 'Submitted' | 'Pending' | 'Running' | 'Completed' | 'Error'

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

  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData')

  const getProgressValue = () => {
    if (job?.scoper) {
      return parseFloat(job?.bullmq?.bullmq?.progress ?? '0')
    }
    return (
      job?.mongo?.progress ?? parseFloat(job?.bullmq?.bullmq?.progress ?? '0')
    )
  }

  if (isLoading) {
    return <PulseLoader color={'#ffffff'} />
  }

  if (isError) {
    return (
      <Alert severity='error' variant='outlined'>
        <AlertTitle>Error loading job.</AlertTitle>
        <ul>
          <li>The backend server may be temporarily unavailable.</li>
          <li>
            Please try again making sure to include the entire job ID in request
            URL.
          </li>
          <li>
            It is also possible that the job has been deleted. We keep results
            for 60 days.
          </li>
        </ul>
      </Alert>
    )
  }

  if (configIsLoading) return <CircularProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration data</Alert>
  if (!config)
    return <Alert severity='warning'>No configuration data available</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'

  const handleDownload = async (id: string) => {
    try {
      const response = await axiosInstance.get(`jobs/${id}/results`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data) {
        const contentDisposition = response.headers['content-disposition']
        let filename = 'download.tar.gz' // Default filename if not specified
        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/.exec(contentDisposition)
          if (matches && matches.length > 1) {
            filename = matches[1]
          }
        }

        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename) // Use dynamic filename
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
      } else {
        console.error('No data to download')
      }
    } catch (error) {
      console.error('Download results error:', error)
    }
  }

  const getStatusColors = (status: JobStatus, theme: Theme) => {
    const statusColors: Record<
      JobStatus,
      { background: string; text: string }
    > = {
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

    // Check if status is defined and exists in the statusColors object.
    if (status in statusColors) {
      return statusColors[status]
    }

    // Default background and text colors
    return {
      background: '#d6e4ff',
      text: theme.palette.mode === 'light' ? 'black' : 'white'
    }
  }

  const statusColors = getStatusColors(
    (job?.mongo.status as JobStatus) || 'Pending',
    theme
  )

  const isMultiMDJob = (
    job: BilboMDJob | BilboMDMultiJob
  ): job is BilboMDMultiJob => {
    return !('__t' in job.mongo) && 'bilbomd_uuids' in job.mongo
  }

  // console.log('job', job)

  const content = job ? (
    <>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid size={{ xs: 6 }}>
          <HeaderBox sx={{ py: '6px' }}>
            <Typography>Job Title</Typography>
          </HeaderBox>
          <Item>
            <Typography variant='h3' sx={{ ml: 1 }}>
              {job.mongo.title}
            </Typography>
          </Item>
        </Grid>

        <Grid size={{ xs: 3 }} sx={{ minWidth: '160px' }}>
          <HeaderBox sx={{ py: '6px' }}>
            <Typography>Status</Typography>
          </HeaderBox>
          <Item
            sx={{
              backgroundColor: statusColors.background,
              color: statusColors.text
            }}
          >
            <Typography variant='h3' sx={{ ml: 1 }}>
              {job.mongo.status}
            </Typography>
          </Item>
        </Grid>

        <Grid size={{ xs: 3 }}>
          <HeaderBox sx={{ py: '6px' }}>
            <Typography>Progress</Typography>
          </HeaderBox>
          <Item sx={{ display: 'flex', alignItems: 'center' }}>
            <LinearProgress
              variant='determinate'
              value={getProgressValue()}
              sx={{ flexGrow: 1 }}
            />
            <Typography variant='h3' sx={{ ml: 1 }}>
              {getProgressValue().toFixed(0)} %
            </Typography>
          </Item>
        </Grid>

        {/* New BilboMD Steps that uses mongo.steps object */}
        {job.mongo.steps && !useNersc && !job.scoper && (
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{
              flexGrow: 1, // Allows this component to grow or shrink
              overflow: 'hidden', // Prevents content from breaking layout
              minWidth: '550px'
            }}
          >
            <BilboMDMongoSteps steps={job.mongo.steps} />
          </Grid>
        )}

        {/* New BilboMD Steps that uses mongo.steps object for NERSC jobs */}
        {job.mongo.steps && useNersc && (
          <Grid
            size={{ xs: 4 }}
            sx={{
              flexGrow: 1, // Allows this component to grow or shrink
              overflow: 'hidden', // Prevents content from breaking layout
              minWidth: '550px'
            }}
          >
            <BilboMDNerscSteps job={job} />
          </Grid>
        )}

        {/* Scoper steps */}
        {job.scoper && (
          <Grid size={{ xs: 12 }}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Scoper Details</Typography>
            </HeaderBox>
            <BilboMDScoperSteps job={job} />
            <BilboMDScoperTable scoper={job.scoper} />
          </Grid>
        )}

        {/* MongoDB Job Details */}
        <Grid
          size={{ xs: 4 }}
          sx={{
            minWidth: '450px',
            flexGrow: 1,

            overflow: 'hidden'
          }}
        >
          {isMultiMDJob(job) ? (
            <MultiMDJobDBDetails job={job as BilboMDMultiJob} />
          ) : (
            <JobDBDetails job={job as BilboMDJob} />
          )}
        </Grid>

        {/* Scoper FoXS Analysis */}
        {job.mongo.status === 'Completed' && job.scoper && id && (
          <Grid size={{ xs: 12 }}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Scoper FoXS Analysis</Typography>
            </HeaderBox>
            <ScoperFoXSAnalysis id={id} />
          </Grid>
        )}

        {/* FoXS Analysis */}
        {job.mongo.status === 'Completed' &&
          (job.mongo.__t === 'BilboMdPDB' ||
            job.mongo.__t === 'BilboMdCRD' ||
            job.mongo.__t === 'BilboMdAuto' ||
            job.mongo.__t === 'BilboMdAlphaFold') &&
          id && (
            <Grid size={{ xs: 12 }}>
              <HeaderBox sx={{ py: '6px' }}>
                <Typography>BilboMD FoXS Analysis</Typography>
              </HeaderBox>
              <FoXSAnalysis id={id} />
            </Grid>
          )}

        {/* Feedback */}
        {job.mongo.status === 'Completed' &&
          (job.mongo.__t === 'BilboMdPDB' ||
            job.mongo.__t === 'BilboMdCRD' ||
            job.mongo.__t === 'BilboMdAuto' ||
            job.mongo.__t === 'BilboMdAlphaFold') &&
          job.mongo.feedback && (
            <Grid size={{ xs: 12 }}>
              <HeaderBox sx={{ py: '6px' }}>
                <Typography>Feedback</Typography>
              </HeaderBox>
              <BilboMdFeedback feedback={job.mongo.feedback} />
            </Grid>
          )}

        {/* Molstar Viewer */}
        {job.mongo.status === 'Completed' &&
          (job.mongo.__t === 'BilboMdPDB' ||
            job.mongo.__t === 'BilboMdCRD' ||
            job.mongo.__t === 'BilboMdAuto' ||
            job.mongo.__t === 'BilboMdAlphaFold' ||
            job.mongo.__t === 'BilboMdScoper') && (
            <Grid size={{ xs: 12 }}>
              <HeaderBox sx={{ py: '6px' }}>
                <Typography>
                  Molstar Viewer{' '}
                  <Box
                    component='span'
                    sx={{ color: 'yellow', fontSize: '0.75em' }}
                  >
                    experimental
                  </Box>
                </Typography>
              </HeaderBox>
              <MolstarViewer job={job} />
            </Grid>
          )}

        {/* Download Results */}
        {job.mongo.status === 'Completed' && (
          <Grid size={{ xs: 12 }}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Results</Typography>
            </HeaderBox>
            <Item>
              <Button
                variant='contained'
                onClick={() => {
                  handleDownload(job.mongo.id)
                }}
                sx={{ my: 2 }}
              >
                Download
              </Button>
              <Typography>
                The{' '}
                <span
                  style={{
                    fontWeight: 'bold',
                    fontFamily: 'Courier, monospace'
                  }}
                >
                  results.tar.gz
                </span>{' '}
                tar archive will contains your original files plus some output
                files from BilboMD.
              </Typography>
            </Item>
          </Grid>
        )}

        {job.mongo.status === 'Error' && (
          <Grid size={{ xs: 12 }}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Error - {job.bullmq.bullmq.failedReason}</Typography>
            </HeaderBox>

            <Item>
              <Alert severity='error' variant='outlined'>
                Hmmmm... Well something didn&apos;t work. Please try submitting
                again and if things still don&apos;t work contact Scott or
                Michal.
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
