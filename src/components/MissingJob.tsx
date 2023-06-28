// import { Link } from 'react-router-dom'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import { Alert } from '@mui/material'
import { Job } from 'features/jobs/jobsApiSlice'

const MissingJob = ({ id }: Job) => {
  useTitle('BilboMD: Missing Job')
  return (
    <Box>
      <Alert severity="warning" variant="outlined">
        No BilboMD Job with id: {id}
      </Alert>
    </Box>
  )
}

export default MissingJob
