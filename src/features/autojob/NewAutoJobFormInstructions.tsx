import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Link
} from '@mui/material'
import { Box } from '@mui/system'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const NewAutoJobFormInstructions = () => (
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
          <b>BilboMD Auto</b> is intended to be run using the outputs from{' '}
          <Link
            href='https://deepmind.google/technologies/alphafold/'
            target='_blank'
            rel='noopener noreferrer'
          >
            AlphaFold2 & AlphaFold-Multimer
          </Link>
          . <b>BilboMD Auto</b> uses the{' '}
          <Link
            href='https://alphafold.ebi.ac.uk/faq#faq-13'
            target='_blank'
            rel='noopener noreferrer'
          >
            Predicted Aligned Error
          </Link>{' '}
          (PAE) from AlphaFold along with the predicted coordinates (as a PDB
          file) to automagically generate CHARMM-compatible input files. The{' '}
          <b>*.pdb</b> and PAE <b>*.json</b> files must be the exact ones
          obtained from AlphaFold since we are also using the{' '}
          <Link
            href='https://alphafold.ebi.ac.uk/faq#faq-12'
            target='_blank'
            rel='noopener noreferrer'
          >
            pLDDT
          </Link>{' '}
          values stored in the B-factor column to guide the selection of rigid
          and flexible regions.
        </Typography>
        <ul>
          <li>
            <Typography>
              An AlphaFold PDB <b>*.pdb</b> file (PDB coordinate file. Make sure
              it matches your PAE file.)
            </Typography>
          </li>
          <li>
            <Typography>
              An AlphaFold PAE <b>*.json</b> file (The PAE matrix output from
              AlphaFold in JSON format.)
            </Typography>
          </li>
          <li>
            <Typography>
              A <b>*.dat</b> file (A 3-column experimental SAXS data file)
            </Typography>
          </li>
        </ul>
      </Box>
    </AccordionDetails>
  </Accordion>
)
export default NewAutoJobFormInstructions
