import React, { useState } from 'react'
import { Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LaunchIcon from '@mui/icons-material/Launch'
import { Box } from '@mui/system'
import { green } from '@mui/material/colors'
import { useNavigate } from 'react-router'

interface CopyableChipProps {
  label: string
  value?: string
  url?: string
}

const CopyableChipRedirection: React.FC<CopyableChipProps> = ({
  label,
  value,
  url
}) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value)
    }
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

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (url) {
      navigate(`/dashboard/jobs/${url}`)
    }
  }

  return (
    <>
      <Chip
        label={
          <Box
            component='span'
            sx={{ display: 'inline-flex', alignItems: 'center' }}
          >
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
            {url && (
              <Tooltip title={`Go to Job ${url}`}>
                <IconButton
                  size='small'
                  onClick={handleLaunch}
                  sx={{ padding: 0 }}
                >
                  <LaunchIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
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

export default CopyableChipRedirection
