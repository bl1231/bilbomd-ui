import React, { useState } from 'react'
import { Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box } from '@mui/system'
import { green } from '@mui/material/colors'
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
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '6px' }}>{value}</span>
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
          </Box>
        }
        variant='outlined'
        sx={{
          fontSize: '0.80rem',
          fontFamily: 'monospace',
          borderColor: 'primary.main',
          backgroundColor: green[100]
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
