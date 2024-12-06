import {
  Typography,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const PAEJiffyInstructions = () => (
  <Accordion defaultExpanded={false}>
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
      <Typography sx={{ mx: 1 }}>
        The <b>PAE Jiffy</b>
        {'\u2122'} will use the{' '}
        <Link
          href='https://alphafold.ebi.ac.uk/faq#faq-13'
          target='_blank'
          rel='noopener noreferrer'
        >
          Predicted Aligned Error
        </Link>{' '}
        (PAE) file - in JSON format - from AlphaFold to <b>automagically*</b>{' '}
        define the rigid bodies and rigid domains. The <b>*.pdb</b> and PAE{' '}
        <b>*.json</b> files must be the ones obtained from AlphaFold since we
        are also using the{' '}
        <Link
          href='https://alphafold.ebi.ac.uk/faq#faq-12'
          target='_blank'
          rel='noopener noreferrer'
        >
          pLDDT
        </Link>{' '}
        values stored in the B-factor column to guide the selection of rigid and
        flexible regions.
      </Typography>
      <Typography component={'span'} variant={'body1'}>
        <ol>
          <li>
            Obtain the PAE file from AlphaFold2 or AlphaFold-Multimer. Either
            from running AlphaFold on your own in a colabfold notebook or
            downloaded from pre-predicted structures available from the{' '}
            <Link
              href='https://alphafold.ebi.ac.uk/'
              target='_blank'
              rel='noopener noreferrer'
            >
              AlphaFold
            </Link>{' '}
            database hosted at EMBL-EBI.
          </li>
          <li>
            Upload the files here and our server will create a CHARMM-compatable{' '}
            <code>const.inp</code> file for you. After you download your{' '}
            <code>const.inp</code> file please check that it makes sense to you
            before using it in a <b>BilboMD</b> run.
          </li>
        </ol>
      </Typography>
      <Typography>
        *The <b>PAE Jiffy</b>
        {'\u2122'} uses the{' '}
        <Link
          href='https://igraph.org/r/html/1.3.0/cluster_leiden.html'
          target='_blank'
          rel='noopener noreferrer'
        >
          cluster_leiden()
        </Link>{' '}
        function from{' '}
        <Link
          href='https://igraph.org/'
          target='_blank'
          rel='noopener noreferrer'
        >
          igraph
        </Link>{' '}
        to find the community structure of a graph using the Leiden algorithm of{' '}
        <Link
          href='https://doi.org/10.1038/s41598-019-41695-z'
          target='_blank'
          rel='noopener noreferrer'
        >
          {' '}
          Traag, van Eck & Waltman
        </Link>
        .
      </Typography>
    </AccordionDetails>
  </Accordion>
)

export default PAEJiffyInstructions
