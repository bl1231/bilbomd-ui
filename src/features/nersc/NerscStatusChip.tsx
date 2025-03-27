import { Chip, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid'

interface NerscStatusChipProps {
  system: {
    name: string
    full_name: string
    system_type: string
    status: string
    updated_at: string
    notes: string[]
  }
}

const NerscStatusChip: React.FC<NerscStatusChipProps> = ({ system }) => {
  const color = system.status === 'active' ? 'success' : 'warning'
  // console.log(system.notes[0])
  let toolTipMessage = 'OK'
  if (system.notes[0]) {
    toolTipMessage = system.notes[0]
  }
  return (
    <Grid sx={{ mx: 0.5, display: 'flex', alignItems: 'center' }}>
      <Tooltip title={toolTipMessage} arrow>
        <Chip label={`${system.full_name}`} color={color} />
      </Tooltip>
    </Grid>
  )
}

export default NerscStatusChip
