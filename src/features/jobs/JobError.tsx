import { axiosInstance, AxiosResponse } from 'app/api/axios'
import { BilboMDJob } from 'types/interfaces'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'slices/authSlice'
import { useEffect, useState, useCallback } from 'react'
import { Box } from '@mui/system'
import Grid from '@mui/material/Grid'

interface JobProps {
  job: BilboMDJob
}

const JobError = ({ job }: JobProps) => {
  const token = useSelector(selectCurrentToken)
  const [logContent, setLogContent] = useState('')
  const [stepWithError, setStepWithError] = useState<string | null>(null)

  const getErrorLog = useCallback(
    async (id: string, step: string) => {
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
        setLogContent(response.data.logContent)
      } catch (error) {
        console.error('Error fetching log file:', error)
      }
    },
    [token]
  )

  useEffect(() => {
    for (const step in job.bullmq.bilbomdStep) {
      const key = step as keyof typeof job.bullmq.bilbomdStep
      if (job.bullmq.bilbomdStep[key] === 'error') {
        setStepWithError(step)
        break
      }
    }
  }, [job])

  useEffect(() => {
    if (stepWithError) {
      getErrorLog(job.mongo.id, stepWithError)
    }
  }, [stepWithError, job.mongo.id, getErrorLog])

  return (
    <Box sx={{ m: 2 }}>
      <Grid>
        <pre>{logContent}</pre>
      </Grid>
    </Box>
  )
}

export default JobError
