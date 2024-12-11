import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Link
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
        <Typography sx={{ m: 1 }}>
          <b>BilboMD SANS</b> will generate a metric ass-tonne of molecular
          models and then do genetic algorithm awesomness{' '}
          <Link
            href='https://github.com/achicks15/GA-SAS'
            target='_blank'
            rel='noopener noreferrer'
          >
            GA-SAS
          </Link>{' '}
          to determine the best models to explain your Small Angle Neutron
          Scattering (SANS) data.
        </Typography>
      </Box>
    </AccordionDetails>
  </Accordion>
)

export default NewSANSJobFormInstructions
