import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import { StyledMenu } from '../../themes/components/StyledDropdownMenu'

interface JobActionsMenuProps {
  jobId: string
  jobType: string
  jobTitle: string
  jobStatus: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onResubmit: (id: string, type: string) => void
  onDelete: (id: string, title: string) => void
}

const JobActionsMenu: React.FC<JobActionsMenuProps> = ({
  jobId,
  jobType,
  jobTitle,
  jobStatus,
  anchorEl,
  open,
  onClose,
  onResubmit,
  onDelete
}) => {
  const handleResubmitClick = () => {
    onResubmit(jobId, jobType)
    onClose()
  }

  const handleDeleteClick = () => {
    onDelete(jobId, jobTitle)
    onClose()
  }

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem
        onClick={handleResubmitClick}
        disableRipple
        disabled={
          !['BilboMdPDB', 'BilboMdCRD', 'BilboMdAuto'].includes(jobType)
        }
      >
        <AutorenewIcon />
        Resubmit
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={handleDeleteClick}
        disableRipple
        disabled={['Running', 'Submitted'].includes(jobStatus)}
        sx={{ color: 'error.main' }}
      >
        <DeleteIcon color='error' />
        Delete
      </MenuItem>
    </StyledMenu>
  )
}

export { JobActionsMenu }
