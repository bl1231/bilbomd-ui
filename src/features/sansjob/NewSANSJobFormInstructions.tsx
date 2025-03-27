import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Link
} from '@mui/material'
import Grid from '@mui/material/Grid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const NewSANSJobFormInstructions = () => (
  <Grid size={{ xs: 12 }}>
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
            <b>BilboMD SANS</b> is a data analysis pipeline that uses a minimal
            MD step with CHARMM to generate thousands of molecular models.
            Theoretical SANS scattering curves are then calculated from these
            models using{' '}
            <Link
              href='https://team.inria.fr/nano-d/software/pepsi-sans/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <b>Pepsi-SANS</b>
            </Link>
            . The models are then analyzed using a genetic algorithm developed
            by Alan Hicks called{' '}
            <Link
              href='https://github.com/achicks15/GA-SAS'
              target='_blank'
              rel='noopener noreferrer'
            >
              <b>GA-SAS</b>
            </Link>{' '}
            to determine the best multi-state models to explain your Small Angle
            Neutron Scattering (SANS) data.
          </Typography>
          <Typography variant='h5' sx={{ mx: 1, my: 3 }}>
            Acknowledgements:
          </Typography>
          <Typography sx={{ m: 1 }}>
            Please Acknowledge the following manuscripts if you use{' '}
            <b>BilboMD SANS</b>:
          </Typography>
          {/* <Typography variant='body2' sx={{ mx: 1, my: 2 }}>
          Pelikan M, Hura GL, Hammel M.{' '}
          <b>
            Structure and flexibility within proteins as identified through
            small angle X-ray scattering.
          </b>{' '}
          Gen Physiol Biophys. 2009 Jun;28(2):174-89. doi:
          10.4149/gpb_2009_02_174. PMID:{' '}
          <Link
            href='https://pubmed.ncbi.nlm.nih.gov/19592714/'
            target='_blank'
            rel='noopener noreferrer'
          >
            19592714
          </Link>
          ; PMCID: PMC3773563.
        </Typography> */}
          <Typography sx={{ mx: 1, my: 2 }}>Ref1</Typography>
          <Typography sx={{ mx: 1, my: 2 }}>Ref2</Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  </Grid>
)

export default NewSANSJobFormInstructions
