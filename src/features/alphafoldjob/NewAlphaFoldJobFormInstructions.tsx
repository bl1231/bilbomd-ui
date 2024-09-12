import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Link,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const NewAlphaFoldJobFormInstructions = () => (
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
          <b>BilboMD AF</b> will take your Protein sequence information and run{' '}
          <Link
            href='https://deepmind.google/technologies/alphafold/'
            target='_blank'
            rel='noopener noreferrer'
          >
            AlphaFold2 or AlphaFold-Multimer
          </Link>
          . <b>BilboMD AF</b> then takes the{' '}
          <Link
            href='https://alphafold.ebi.ac.uk/faq#faq-13'
            target='_blank'
            rel='noopener noreferrer'
          >
            Predicted Aligned Error
          </Link>{' '}
          (PAE) from AlphaFold along with the top scoring AlphaFold model to
          automagically generate CHARMM-compatible input files to feed into the
          standard <b>BilboMD</b> pipeline. In addition to the PAE matrix,{' '}
          <b>BilboMD AF</b> uses the{' '}
          <Link
            href='https://alphafold.ebi.ac.uk/faq#faq-12'
            target='_blank'
            rel='noopener noreferrer'
          >
            pLDDT
          </Link>{' '}
          values stored in the B-factor column to help guide the selection of
          rigid and flexible regions.
        </Typography>
        <Typography sx={{ m: 1 }}>Required inputs:</Typography>
        <ul>
          <li>
            <Typography>
              Define the sequence and number of copies of each Protein chain in
              your macromolecue or complex. <b>BilboMD AF</b> jobs are run on
              NERSC Perlmutter GPU nodes equipped with NVIDIA A100 GPUs with
              either 40GB or 80GB of GPU RAM, and should be able to process up
              to 3,300 AAs in a single run.
            </Typography>
          </li>
          <li>
            <Typography>
              A <b>*.dat</b> file (A 3-column experimental SAXS data file)
            </Typography>
          </li>
        </ul>
        <Alert severity='info' sx={{ my: 2 }}>
          <AlertTitle>
            Important information about AlphaFold2 vs. AlphaFold3
          </AlertTitle>
          <Typography>
            <b>BilboMD AF</b> uses ColabFold under the hood which in turn uses
            AlphaFold2 (with either the AF2 or AF2-multimer prediction models ),
            therefore we can only process single Protein chains or Protein
            complexes composed of multiple chains. If you want to predict
            Protein/DNA, Protien/RNA, or other more complicated Macromolecules
            you should run{' '}
            <Link
              href='https://alphafoldserver.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              AlphaFold3
            </Link>{' '}
            on your own and then bring the PDB and PAE.json files back here to
            run a <b>BilboMD Auto</b> pipeline.
          </Typography>
        </Alert>
        <Typography sx={{ m: 1 }}>
          If you would like to better understand how <b>ColabFold</b> speeds up
          &ldquo;standard&rdquo; AlphaFold predictions (hint: it&apos;s the MSA
          alignments) please see these resources:
        </Typography>
        <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
          Mirdita M, Schütze K, Moriwaki Y, Heo L, Ovchinnikov S, Steinegger M.{' '}
          <b>ColabFold: making protein folding accessible to all.</b> Nat
          Methods. 2022 Jun;19(6):679-682. doi: 10.1038/s41592-022-01488-1. Epub
          2022 May 30. PMID:
          <Link
            href='https://pubmed.ncbi.nlm.nih.gov/35637307/'
            target='_blank'
            rel='noopener noreferrer'
          >
            35637307
          </Link>
          ; PMCID: PMC9184281.
        </Typography>
        <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
          Gyuri Kim, Sewon Lee, Eli Levy Karin et al.{' '}
          <b>Easy and accurate protein structure prediction using ColabFold.</b>{' '}
          <Link
            href='https://doi.org/10.21203/rs.3.pex-2490/v1'
            target='_blank'
            rel='noopener noreferrer'
          >
            Version 1, 01 Dec, 2023 Protocol Exchange
          </Link>
        </Typography>
      </Box>
    </AccordionDetails>
  </Accordion>
)

export default NewAlphaFoldJobFormInstructions
