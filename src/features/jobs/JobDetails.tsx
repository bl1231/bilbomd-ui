// import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface Job {
  id: string
  title: string
  // Add other properties if needed
}

interface JobDetailsProps {
  job: Job
}

const JobDetails = ({ job }: JobDetailsProps) => {
  const { id, title } = job
  const navigate = useNavigate()
  return (
    <>
      <Tooltip title={`Details for ${title}`} arrow>
        <IconButton
          color="secondary"
          onClick={() => {
            navigate(id)
          }}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default JobDetails
