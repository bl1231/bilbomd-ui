import { useParams } from 'react-router-dom'
import { useGetJobByIdQuery } from 'slices/jobsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import {
  Button,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
  Box
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import { styled, useTheme } from '@mui/material/styles'
import { axiosInstance } from 'app/api/axios'
import MissingJob from 'components/MissingJob'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
import BilboMDSteps from './BilboMDSteps'
import BilboMDNerscSteps from './BilboMDNerscSteps'
import { BilboMDScoperSteps } from './BilboMDScoperSteps'
import HeaderBox from 'components/HeaderBox'
import JobError from './JobError'
import JobDBDetails from './JobDBDetails'
import MolstarViewer from 'features/molstar/Viewer'
import { BilboMDScoperTable } from '../scoperjob/BilboMDScoperTable'
import ScoperFoXSAnalysis from 'features/scoperjob/ScoperFoXSAnalysis'
import FoXSAnalysis from './FoXSAnalysis'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

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

  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})

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
        <Grid size={{ xs: 3 }}>
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
              value={parseFloat(job.bullmq?.bullmq?.progress ?? '0')}
              sx={{ flexGrow: 1 }}
            />
            <Typography variant='h3' sx={{ ml: 1 }}>
              {parseFloat(job.bullmq?.bullmq?.progress ?? '0').toFixed(0)} %
            </Typography>
          </Item>
        </Grid>

        {job.bullmq && !useNersc && (
          <Grid size={{ xs: 12 }}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Steps</Typography>
            </HeaderBox>
            <BilboMDSteps job={job} />
          </Grid>
        )}

        {job.mongo.steps && useNersc && (
          <Grid size={{ xs: 12 }}>
            <BilboMDNerscSteps job={job} />
          </Grid>
        )}

        {job.scoper && (
          <Grid size={{ xs: 12 }}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Scoper Details</Typography>
            </HeaderBox>
            <BilboMDScoperSteps job={job} />
            <BilboMDScoperTable scoper={job.scoper} />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <JobDBDetails job={job} />
        </Grid>

        {job.mongo.status === 'Completed' && job.scoper && id && (
          <Grid size={{ xs: 12 }}>
            <HeaderBox sx={{ py: '6px' }}>
              <Typography>Scoper FoXS Analysis</Typography>
            </HeaderBox>
            <ScoperFoXSAnalysis id={id} />
          </Grid>
        )}

        {job.mongo.status === 'Completed' &&
          (job.classic || job.auto || job.mongo.__t == 'BilboMdAlphaFold') &&
          id && (
            <Grid size={{ xs: 12 }}>
              <HeaderBox sx={{ py: '6px' }}>
                <Typography>BilboMD FoXS Analysis</Typography>
              </HeaderBox>
              <FoXSAnalysis id={id} />
            </Grid>
          )}

        {job.mongo.status === 'Completed' && (
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
                will contains your original files plus some output files from
                Scoper.
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
