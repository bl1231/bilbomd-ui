import InfoIcon from '@mui/icons-material/Info'
import { Button } from '@mui/material'
import { useLocation, Link } from 'react-router'

interface JobDetailsProps {
  id: string
}

const JobDetails = ({ id }: JobDetailsProps) => {
  const location = useLocation()
  const search = location.search

  return (
    <Button
      variant='outlined'
      size='small'
      className='job-details-button'
      startIcon={<InfoIcon />}
      component={Link}
      to={`/dashboard/jobs/${id}`}
      state={{ returnParams: search }}
    >
      Details
    </Button>
  )
}

export default JobDetails
