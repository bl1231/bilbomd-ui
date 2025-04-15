import { Typography, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import HeaderBox from 'components/HeaderBox'

const PipelineSchematic = ({
  isDarkMode,
  pipeline
}: {
  isDarkMode: boolean
  pipeline: string
}) => (
  <Grid size={{ xs: 12 }}>
    <HeaderBox>
      <Typography>
        BilboMD Classic Schematic -{' '}
        {pipeline === 'pdb' ? 'PDB inputs' : 'CRD/PSF inputs'}
      </Typography>
    </HeaderBox>
    <Paper sx={{ p: 2 }}>
      <img
        src={
          pipeline === 'pdb'
            ? isDarkMode
              ? '/images/bilbomd-classic-pdb-schematic-dark.png'
              : '/images/bilbomd-classic-pdb-schematic.png'
            : isDarkMode
              ? '/images/bilbomd-classic-crd-schematic-dark.png'
              : '/images/bilbomd-classic-crd-schematic.png'
        }
        alt={
          pipeline === 'pdb'
            ? 'Overview of BilboMD PDB pipeline'
            : 'Overview of BilboMD CRD/PSF pipeline'
        }
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Paper>
  </Grid>
)

export default PipelineSchematic
