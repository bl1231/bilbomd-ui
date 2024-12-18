import { useState } from 'react'
import { Snackbar, Button } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

interface CopyToClipboardButtonProps {
  text: string
}

const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <Button
        variant='outlined'
        startIcon={<ContentCopyIcon />}
        onClick={handleClick}
        size='small'
      >
        Copy
      </Button>
      <Snackbar
        message='Copied to clipboard'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  )
}

export default CopyToClipboardButton
