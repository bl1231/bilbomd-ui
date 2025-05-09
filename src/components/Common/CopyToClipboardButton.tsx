import { Button } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useSnackbar } from 'notistack'

interface CopyToClipboardButtonProps {
  text: string
}

const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const { enqueueSnackbar } = useSnackbar()

  const handleClick = () => {
    navigator.clipboard.writeText(text)
    enqueueSnackbar('Copied to clipboard', { variant: 'success' })
  }

  return (
    <Button
      variant='outlined'
      startIcon={<ContentCopyIcon />}
      onClick={handleClick}
      size='small'
    >
      Copy
    </Button>
  )
}

export default CopyToClipboardButton
