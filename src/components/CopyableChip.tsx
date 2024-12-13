import React, { useState } from 'react'
import { Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

interface CopyableChipProps {
  label: string
  value: string
}

const CopyableChip: React.FC<CopyableChipProps> = ({ label, value }) => {
  const [open, setOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setOpen(true)
  }

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <>
      <Chip
        label={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>{value}</span>
            <Tooltip title={`Copy ${label}`}>
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
                sx={{ padding: 0 }}
              >
                <ContentCopyIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </div>
        }
        variant='outlined'
        sx={{
          fontSize: '0.875rem',
          borderColor: 'primary.main',
          ml: 2
        }}
      />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          {label} copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}

export default CopyableChip
