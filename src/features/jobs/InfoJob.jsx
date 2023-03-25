import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const InfoJob = ({ job }) => {
  const { id, title } = job
  const navigate = useNavigate()
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default InfoJob
