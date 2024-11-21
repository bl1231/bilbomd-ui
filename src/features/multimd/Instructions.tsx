import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Instructions = () => (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
      sx={{
        backgroundColor: '#888',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        pl: 1
      }}
    >
      <Typography
        sx={{
          textTransform: 'uppercase',
          fontSize: '0.875rem',
          fontWeight: 400,
          color: '#fff',
          letterSpacing: '1px'
        }}
      >
        Instructions
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box>
        <Typography>
          <b>BilboMD Multi</b> allows you to combine the outputs from multiple
          BilboMD runs (i.e. the combined output of all CHARMM MD simulations)
          and analyze them together ina asingel MultiFoXS run. Because MultiFoXS
          requires a single experimental data file you will need to decide which
          experimental SAXS data file to use.
        </Typography>
      </Box>
    </AccordionDetails>
  </Accordion>
)

export { Instructions }
