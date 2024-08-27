import useAuth from 'hooks/useAuth'
import useTitle from 'hooks/useTitle'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { Typography, Link } from '@mui/material'
import Grid from '@mui/material/Grid'
import NerscSystemStatuses from 'features/nersc/SystemStatuses'

const Welcome = () => {
  const { username } = useAuth()
  useTitle(`BilboMD: Welcome ${username}`)
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})

  const content = (
    <>
      <Typography variant='h2' sx={{ my: 3 }}>
        Welcome {username}!
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Let&apos;s run some <b>BilboMD</b> simulations.
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {configIsLoading ? (
          'Loading system configuration...'
        ) : configError ? (
          'Failed to load system configuration.'
        ) : (
          <>
            BilboMD is running in <b>{config.mode}</b> mode
            <br />
            BilboMD is deployed to{' '}
            <b>
              {config.useNersc && config.useNersc.toLowerCase() === 'true' ? (
                <>
                  <span>NERSC</span>
                  <Grid>
                    <NerscSystemStatuses />
                  </Grid>
                </>
              ) : (
                <span>Beamline 12.3.1</span>
              )}
            </b>
          </>
        )}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Web implementation:{' '}
        <Link href='mailto:sclassen@lbl.gov'>Scott Classen</Link>
        <br />
        BilboMD-specific Questions:{' '}
        <Link href='mailto:mhammel@lbl.gov'>Michal Hammel</Link>
      </Typography>

      <Typography variant='h4' sx={{ my: 3 }}>
        Acknowledgements:
      </Typography>
      <Typography>
        Please Acknowledge the following manuscripts if you use <b>BilboMD</b>:
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Pelikan M, Hura GL, Hammel M.{' '}
        <b>
          Structure and flexibility within proteins as identified through small
          angle X-ray scattering.
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
      </Typography>

      <Typography>
        <b>BilboMD</b> makes use of{' '}
        <Link
          href='https://academiccharmm.org/'
          target='_blank'
          rel='noopener noreferrer'
        >
          CHARMM
        </Link>
        ,{' '}
        <Link
          href='https://www.charmm-gui.org/'
          target='_blank'
          rel='noopener noreferrer'
        >
          CHARMM-GUI
        </Link>
        ,{' '}
        <Link
          href='https://modbase.compbio.ucsf.edu/foxs/about'
          target='_blank'
          rel='noopener noreferrer'
        >
          FoXS
        </Link>
        ,{' '}
        <Link
          href='https://modbase.compbio.ucsf.edu/multifoxs/about'
          target='_blank'
          rel='noopener noreferrer'
        >
          MultiFoXS
        </Link>
        , and{' '}
        <Link
          href='https://bioxtas-raw.readthedocs.io/en/latest/'
          target='_blank'
          rel='noopener noreferrer'
        >
          BioXTAS RAW
        </Link>
        . Please also consider citing them:
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Brooks BR, Brooks CL 3rd, Mackerell AD Jr, Nilsson L, Petrella RJ, Roux
        B, Won Y, Archontis G, Bartels C, Boresch S, Caflisch A, Caves L, Cui Q,
        Dinner AR, Feig M, Fischer S, Gao J, Hodoscek M, Im W, Kuczera K,
        Lazaridis T, Ma J, Ovchinnikov V, Paci E, Pastor RW, Post CB, Pu JZ,
        Schaefer M, Tidor B, Venable RM, Woodcock HL, Wu X, Yang W, York DM,
        Karplus M. <b>CHARMM: the biomolecular simulation program.</b> J Comput
        Chem. 2009 Jul 30;30(10):1545-614. doi: 10.1002/jcc.21287. PMID:{' '}
        <Link
          href='https://pubmed.ncbi.nlm.nih.gov/19444816/'
          target='_blank'
          rel='noopener noreferrer'
        >
          19444816
        </Link>
        ; PMCID: PMC2810661.
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Schneidman-Duhovny D, Hammel M, Tainer JA, Sali A.{' '}
        <b>
          Accurate SAXS profile computation and its assessment by contrast
          variation experiments.
        </b>{' '}
        Biophys J. 2013 Aug 20;105(4):962-74. doi: 10.1016/j.bpj.2013.07.020.
        PMID:{' '}
        <Link
          href='https://pubmed.ncbi.nlm.nih.gov/23972848/'
          target='_blank'
          rel='noopener noreferrer'
        >
          23972848
        </Link>
        ; PMCID: PMC3752106.
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Schneidman-Duhovny D, Hammel M, Tainer JA, Sali A.{' '}
        <b>
          FoXS, FoXSDock and MultiFoXS: Single-state and multi-state structural
          modeling of proteins and their complexes based on SAXS profiles.
        </b>{' '}
        Nucleic Acids Res. 2016 Jul 8;44(W1):W424-9. doi: 10.1093/nar/gkw389.
        Epub 2016 May 5. PMID:{' '}
        <Link
          href='https://pubmed.ncbi.nlm.nih.gov/27151198/'
          target='_blank'
          rel='noopener noreferrer'
        >
          27151198
        </Link>
        ; PMCID: PMC4987932.
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Jo S, Kim T, Iyer VG, Im W.{' '}
        <b>CHARMM-GUI: a web-based graphical user interface for CHARMM.</b> J
        Comput Chem. 2008 Aug;29(11):1859-65. doi: 10.1002/jcc.20945. PMID:{' '}
        <Link
          href='https://pubmed.ncbi.nlm.nih.gov/18351591/'
          target='_blank'
          rel='noopener noreferrer'
        >
          18351591
        </Link>
        .
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Jo S, Cheng X, Islam SM, Huang L, Rui H, Zhu A, Lee HS, Qi Y, Han W,
        Vanommeslaeghe K, MacKerell AD Jr, Roux B, Im W.{' '}
        <b>
          CHARMM-GUI PDB manipulator for advanced modeling and simulations of
          proteins containing nonstandard residues.
        </b>{' '}
        Adv Protein Chem Struct Biol. 2014;96:235-65. doi:
        10.1016/bs.apcsb.2014.06.002. Epub 2014 Aug 24. PMID:{' '}
        <Link
          href='https://pubmed.ncbi.nlm.nih.gov/25443960/'
          target='_blank'
          rel='noopener noreferrer'
        >
          25443960
        </Link>
        ; PMCID: PMC4739825.
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Park SJ, Kern N, Brown T, Lee J, Im W.{' '}
        <b>
          CHARMM-GUI PDB Manipulator: Various PDB Structural Modifications for
          Biomolecular Modeling and Simulation.
        </b>{' '}
        J Mol Biol. 2023 Jul 15;435(14):167995. doi: 10.1016/j.jmb.2023.167995.
        Epub 2023 Feb 2. PMID:{' '}
        <Link
          href='https://pubmed.ncbi.nlm.nih.gov/37356910/'
          target='_blank'
          rel='noopener noreferrer'
        >
          37356910
        </Link>
        ; PMCID: PMC10291205.
      </Typography>
      <Typography variant='body2' sx={{ mx: 2, my: 2 }}>
        Hopkins JB{' '}
        <b>
          BioXTAS RAW 2: new developments for a free open-source program for
          small-angle scattering data reduction and analysis
        </b>{' '}
        J Appl Crystallogr. 2024 Feb 1;57(Pt 1):194-208. doi:
        10.1107/S1600576723011019. PMID:{' '}
        <Link
          href='https://pubmed.ncbi.nlm.nih.gov/38322719/'
          target='_blank'
          rel='noopener noreferrer'
        >
          38322719
        </Link>
        ; PMCID: PMC10840314.
      </Typography>
      <Typography>
        Other projects and code that powers the AlphaFold PAE Jiffy to
        automatically create a CHARMM <code>const.inp</code> file:
      </Typography>
      <ul>
        <li>
          <Link
            href='https://github.com/google-deepmind/alphafold'
            target='_blank'
            rel='noopener noreferrer'
          >
            AlphaFold
          </Link>
        </li>
        <li>
          <Link
            href='https://python.igraph.org/en/stable/'
            target='_blank'
            rel='noopener noreferrer'
          >
            igraph
          </Link>
        </li>
        <li>
          <Link
            href='https://numpy.org/'
            target='_blank'
            rel='noopener noreferrer'
          >
            NumPy
          </Link>
        </li>
      </ul>
    </>
  )

  return content
}

export default Welcome
