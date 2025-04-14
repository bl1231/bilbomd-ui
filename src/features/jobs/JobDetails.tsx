import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip } from '@mui/material'
import { useLocation, Link } from 'react-router'

interface JobDetailsProps {
  id: string
  title: string
}

const JobDetails = ({ id, title }: JobDetailsProps) => {
  const location = useLocation()
  const search = location.search

  return (
    <>
      <Tooltip title={`Details for ${title}`} arrow>
        <IconButton
          component={Link}
          to={`/dashboard/jobs/${id}`}
          state={{ returnParams: search }}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default JobDetails
