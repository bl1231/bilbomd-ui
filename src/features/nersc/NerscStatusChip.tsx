import { Chip, Grid } from '@mui/material'

interface NerscStatusChipProps {
  system: {
    name: string
    full_name: string
    system_type: string
    status: string
    updated_at: string
  }
}

const NerscStatusChip: React.FC<NerscStatusChipProps> = ({ system }) => {
  const color = system.status === 'active' ? 'success' : 'warning'

  return (
    <Grid sx={{ m: 0.5, display: 'flex', alignItems: 'center' }}>
      <Chip label={`${system.full_name}: ${system.status}`} color={color} />
    </Grid>
  )
}

export default NerscStatusChip
