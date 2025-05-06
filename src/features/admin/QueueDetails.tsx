import InfoIcon from '@mui/icons-material/Info'
import { Button } from '@mui/material'
import { Link as RouterLink } from 'react-router'

interface QueueDetailsProps {
  queue: string
}

const QueueDetails = ({ queue }: QueueDetailsProps) => {
  return (
    <Button
      variant='outlined'
      size='small'
      className='queue-details-button'
      startIcon={<InfoIcon />}
      component={RouterLink}
      to={`/queue/${queue}`}
    >
      Details
    </Button>
  )
}

export default QueueDetails
