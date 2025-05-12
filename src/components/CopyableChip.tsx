import React from 'react'
import { Chip, IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LaunchIcon from '@mui/icons-material/Launch'
import { Box } from '@mui/system'
import { green } from '@mui/material/colors'
import { useNavigate } from 'react-router'
import { useSnackbar } from 'notistack'

interface CopyableChipProps {
  label: string
  value?: string
  url?: string
}

const CopyableChip: React.FC<CopyableChipProps> = ({ label, value, url }) => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value)
      enqueueSnackbar(`${label} copied to clipboard!`, { variant: 'default' })
    }
  }

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (url) {
      navigate(url)
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
              <Tooltip title={`Go to ${url}`}>
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
    </>
  )
}

export default CopyableChip
