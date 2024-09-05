import { axiosInstance, AxiosResponse } from 'app/api/axios'
import { BilboMDJob } from 'types/interfaces'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import Grid from '@mui/material/Grid2'

interface JobProps {
  job: BilboMDJob
}

const JobError = ({ job }: JobProps) => {
  const token = useSelector(selectCurrentToken)
  const [logContent, setLogContent] = useState('')

  const getErrorLog = async (id: string, step: string) => {
    try {
      const response: AxiosResponse = await axiosInstance.get(
        `jobs/${id}/logs?step=${step}`,
        {
          responseType: 'json',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      // console.log(response.data)
      setLogContent(response.data.logContent)
    } catch (error) {
      console.error('Error fetching log file:', error)
    }
  }

  useEffect(() => {
    let stepWithError: string | undefined = undefined
    // console.log('job', job)
    for (const step in job.bullmq.bilbomdStep) {
      if (job.bullmq.bilbomdStep[step] === 'error') {
        stepWithError = step
        // console.log('found error on step: ', stepWithError)
        break // Exit the loop when the first error step is found
      }
    }

    return () => {
      if (stepWithError) {
        getErrorLog(job.mongo.id, stepWithError)
      }
    }
  }, [job])

  return (
    <Box sx={{ m: 2 }}>
      <Grid>
        <pre>{logContent}</pre>
      </Grid>
    </Box>
  )
}

export default JobError
