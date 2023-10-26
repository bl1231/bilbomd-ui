// import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip } from '@mui/material'
import { Job } from 'types/interfaces'
import { Link } from 'react-router-dom'

interface JobDetailsProps {
  job: Job
}

const JobDetails = ({ job }: JobDetailsProps) => {
  // console.log('JobDetails--->', job)
  const { id, title } = job

  return (
    <>
      <Tooltip title={`Details for ${title}`} arrow>
        <IconButton color="secondary" component={Link} to={`/dashboard/jobs/${id}`}>
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default JobDetails
