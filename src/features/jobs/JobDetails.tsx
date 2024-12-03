import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip } from '@mui/material'
import { Link } from 'react-router'

interface JobDetailsProps {
  id: string
  title: string
}

const JobDetails = ({ id, title }: JobDetailsProps) => {
  return (
    <>
      <Tooltip title={`Details for ${title}`} arrow>
        <IconButton component={Link} to={`/dashboard/jobs/${id}`}>
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default JobDetails
