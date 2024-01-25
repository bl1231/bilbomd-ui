// import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip } from '@mui/material'
// import { Job } from 'types/interfaces'
import { Link } from 'react-router-dom'

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
