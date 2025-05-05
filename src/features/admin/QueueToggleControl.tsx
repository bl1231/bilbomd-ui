import { FormControlLabel, Switch } from '@mui/material'
import {
  usePauseQueueMutation,
  useResumeQueueMutation
} from '../../slices/adminApiSlice'

interface QueueToggleControlProps {
  queueName: string
  isPaused: boolean
}

const QueueToggleControl = ({
  queueName,
  isPaused
}: QueueToggleControlProps) => {
  const [pauseQueue] = usePauseQueueMutation()
  const [resumeQueue] = useResumeQueueMutation()

  const handleToggle = () => {
    if (isPaused) {
      resumeQueue(queueName)
    } else {
      pauseQueue(queueName)
    }
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={!isPaused}
          onChange={handleToggle}
          size='small'
          color='primary'
        />
      }
      label={isPaused ? 'Paused' : 'Running'}
    />
  )
}

export { QueueToggleControl }
