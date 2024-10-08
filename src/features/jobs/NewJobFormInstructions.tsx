import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Divider,
  Link,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const NewJobFormInstructions = () => (
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
      <Typography sx={{ mx: 1, my: 2 }}>
        <b>BilboMD Classic</b> uses{' '}
        <Link
          href='https://academiccharmm.org/'
          target='_blank'
          rel='noopener noreferrer'
        >
          CHARMM
        </Link>{' '}
        to generate an ensemble of molecular models. In order for the Molecular
        Dynamics steps to run successfully you must provide compatible input
        files.
        <br />
      </Typography>
      <Typography sx={{ mx: 1, my: 2 }}>
        Use <b>BilboMD Classic</b> if you want more control over the inputs. For
        example, if you have DNA, RNA, or other ligands and post-translational
        modifications then you should use{' '}
        <Link
          href='https://www.charmm-gui.org/'
          target='_blank'
          rel='noopener noreferrer'
        >
          CHARMM-GUI
        </Link>{' '}
        to paramaterize your input model. If you have generated your own{' '}
        <b>const.inp</b> file, either manually or via one of our Jiffys, then
        maybe <b>BilboMD Classic</b> is right for you. <br />
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          CRD/PSF Inputs
        </AccordionSummary>
        <Typography sx={{ mx: 1, my: 2 }}>
          Required input files if you select the <b>CRD/PSF option</b>:
          <li>
            <b>*.crd</b> file (A CHARMM coordinate file)
          </li>
          <li>
            <b>*.psf</b> file (A CHARMM{' '}
            <Link
              href='https://academiccharmm.org/documentation/version/c47b2/struct'
              target='_blank'
              rel='noopener noreferrer'
            >
              data structure
            </Link>{' '}
            file)
          </li>
          <li>
            <b>*.inp</b> file (defining the rigid domains of your protein.
            Typically named <b>const.inp</b> )
          </li>
          <li>
            <b>*.dat</b> file (A 3-column SAXS data file)
          </li>
        </Typography>
        <Typography sx={{ mx: 1, my: 2 }}>
          Use the <b>PDB Reader</b> tool available from{' '}
          <Link
            href='https://www.charmm-gui.org/'
            target='_blank'
            rel='noopener noreferrer'
          >
            CHARMM-GUI
          </Link>{' '}
          to convert your standard PDB file to a CRD file. If you need help
          generating a valid <b>const.inp</b> file you can use our{' '}
          <Link href='/dashboard/jobs/constinp'>
            <b>inp Jiffy{'\u2122'}</b>
          </Link>{' '}
          to help get you started.
        </Typography>
        <Alert severity='warning'>
          <AlertTitle>
            Warning about Chain ID and segid naming conventions
          </AlertTitle>
          <Typography sx={{ mx: 1, my: 2 }}>
            If using CRD/PSF files coming from CHARMM-GUI make sure that the{' '}
            <b>segid</b> names in your CRD file match the <b>segid</b> names in
            you <b>const.inp</b> file. This is because CHARMM-GUI uses{' '}
            <b>segid</b> formats PRO[A-Z] (protein), DNA[A-Z] (DNA), RNA[A-Z]
            (RNA), and HET[A-Z] (ligands), instead of your original PDB chain
            id, and will rename the first protein chain in your PDB file as
            segid <b>PROA</b> and the second protein chain as segid <b>PROB</b>{' '}
            etc. even if the original chain IDs were something other than A and
            B.
          </Typography>
        </Alert>
      </Accordion>
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          PDB Inputs
        </AccordionSummary>
        <Typography sx={{ mx: 1, my: 2 }}>
          Required input files if you select the <b>PDB option</b>:
          <li>
            <b>*.pdb</b> file (A PDB coordinate file)
          </li>
          <li>
            <b>*.inp</b> file (defining the rigid domains of your protein.
            Typically named <b>const.inp</b> )
          </li>
          <li>
            <b>*.dat</b> file (A 3-column SAXS data file)
          </li>
        </Typography>
        <Typography sx={{ mx: 1, my: 2 }}>
          <b>BilboMD Classic</b> will convert your PDB file to the required CRD
          and PSF files. However, we do this slightly differently than
          CHARMM-GUI. The main difference is the way we rename the chains for
          input to CHARMM. Essentially we retain your original chain IDs wheras
          CHARMM-GUI renames the first Protein chain as segid <b>PROA</b>, the
          second Protein chain as segid <b>PROB</b>,{' '}
          <span style={{ fontStyle: 'italic' }}>etc</span>. (see the notes
          above). For that reason we strongly recommend that you use our{' '}
          <b>inp Jiffy{'\u2122'}</b> to create your <b>const.inp</b> file. Feel
          free to manually edit it, but pay attention to segid names.
        </Typography>
      </Accordion>
      <Divider textAlign='left' sx={{ my: 1, mt: 2 }}>
        Other settings
      </Divider>
      <Typography sx={{ mx: 1, my: 2 }}>
        <b>Conformations per Rg</b> - Specify the number of atomic models to be
        calculated for each Rg Step (Radius of Gyration - explanation below).
        More models will increase the conformational space sampled at the
        expense of slightly longer computational times.
      </Typography>
      <Typography sx={{ mx: 1, my: 2 }}>
        <b>Rg Steps</b> - Define the Radius of Gyration range (as <b>Rg Min</b>
        and <b>Rg Max</b>) that will constrain the MD simulations.{' '}
        <b>BilboMD</b> will calculate 5 equidistant steps bewteen <b>Rg Min</b>{' '}
        and <b>Rg Max</b> to perform Molecular Dynamics. A good rule-of-thumb
        for your initial <b>BilboMD Classic</b> run is to select initial{' '}
        <b>Rg Min</b> and <b>Rg Max</b> values from -7% to +25% around your
        experimental Rg respectively. If your experimental Rg is 25-30 &#8491;,
        the MD simulations can behave eradically if you specify an <b>Rg Min</b>{' '}
        that is too small. This is why we recommend <b>Rg Min</b> to be ~ 7%
        less than your experimental Rg. However, if your experimental Rg is
        larger (e.g. &gt;50 &#8491;) then you can probably explore a wider range
        and pick <b>Rg Min</b> and <b>Rg Max</b> values that are +/- 25%.
      </Typography>
    </AccordionDetails>
  </Accordion>
)

export default NewJobFormInstructions
