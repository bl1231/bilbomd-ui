import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import { StyledMenu } from '../../themes/components/StyledDropdownMenu'

interface QueueJobActionsMenuProps {
  jobId: string
  jobType: string
  jobTitle: string
  jobStatus: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onRetry: (id: string) => void
  onDelete: (id: string) => void
}

const QueueJobActionsMenu: React.FC<QueueJobActionsMenuProps> = ({
  jobId,
  jobStatus,
  anchorEl,
  open,
  onClose,
  onRetry,
  onDelete
}) => {
  const handleRetryClick = () => {
    onRetry(jobId)
    onClose()
  }

  const handleDeleteClick = () => {
    onDelete(jobId)
    onClose()
  }

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={handleRetryClick} disableRipple>
        <AutorenewIcon />
        Retry
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

export { QueueJobActionsMenu }
