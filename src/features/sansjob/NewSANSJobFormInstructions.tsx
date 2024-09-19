import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const NewSANSJobFormInstructions = () => (
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
          fontSize: 12,
          fontWeight: 500,
          color: '#fff',
          letterSpacing: '1px'
        }}
      >
        Instructions
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box>
        <Typography sx={{ m: 1 }}>
          <b>BilboMD SANS</b> will generate a metric ass-tonne of molecular
          models and then do genetic algorithm awesomness to determine the best
          models to explain your Small Angle Neutron Scattering data.
        </Typography>
      </Box>
    </AccordionDetails>
  </Accordion>
)

export default NewSANSJobFormInstructions
