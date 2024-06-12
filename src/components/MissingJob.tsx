import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import { Alert } from '@mui/material'

interface MissingJobProps {
  id?: string
}

const MissingJob = ({ id }: MissingJobProps) => {
  useTitle('BilboMD: Missing Job')
  return (
    <Box>
      <Alert severity='warning' variant='outlined'>
        No BilboMD Job with id: {id}
      </Alert>
    </Box>
  )
}

export default MissingJob
