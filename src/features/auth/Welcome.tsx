import useAuth from 'hooks/useAuth'
import useTitle from 'hooks/useTitle'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

const Welcome = () => {
  const { username } = useAuth()

  useTitle(`BilboMD: ${username}`)

  const content = (
    <>
      <Typography variant="h2" sx={{ my: 3 }}>
        Welcome {username}!
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Let&apos;s run some <b>BilboMD</b> simulations.
      </Typography>
      <Typography sx={{ mb: 2 }}>
        System is running in {process.env.NODE_ENV} mode
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Web implementation: <Link to="mailto:sclassen@lbl.gov">Scott Classen</Link>
        <br />
        BilboMD-specific Questions: <Link to="mailto:mhammel@lbl.gov">Michal Hammel</Link>
      </Typography>
      <Typography>
        Please Acknowledge the following manuscripts if you use <b>BilboMD</b>:
      </Typography>
      <Typography variant="body2" sx={{ mx: 2, my: 2 }}>
        Pelikan M, Hura GL, Hammel M.{' '}
        <b>
          Structure and flexibility within proteins as identified through small angle
          X-ray scattering.
        </b>{' '}
        Gen Physiol Biophys. 2009 Jun;28(2):174-89. doi: 10.4149/gpb_2009_02_174. PMID:{' '}
        <Link to="https://pubmed.ncbi.nlm.nih.gov/19592714/">19592714</Link>; PMCID:
        PMC3773563.
      </Typography>

      <Typography>
        <b>BilboMD</b> makes use of <Link to="https://academiccharmm.org/">CHARMM</Link>,{' '}
        <Link to="https://modbase.compbio.ucsf.edu/foxs/about">FoXS</Link>, and{' '}
        <Link to="https://modbase.compbio.ucsf.edu/multifoxs/about">MultiFoXS</Link>.
        Please also consider citing them:
      </Typography>
      <Typography variant="body2" sx={{ mx: 2, my: 2 }}>
        Brooks BR, Brooks CL 3rd, Mackerell AD Jr, Nilsson L, Petrella RJ, Roux B, Won Y,
        Archontis G, Bartels C, Boresch S, Caflisch A, Caves L, Cui Q, Dinner AR, Feig M,
        Fischer S, Gao J, Hodoscek M, Im W, Kuczera K, Lazaridis T, Ma J, Ovchinnikov V,
        Paci E, Pastor RW, Post CB, Pu JZ, Schaefer M, Tidor B, Venable RM, Woodcock HL,
        Wu X, Yang W, York DM, Karplus M.{' '}
        <b>CHARMM: the biomolecular simulation program.</b> J Comput Chem. 2009 Jul
        30;30(10):1545-614. doi: 10.1002/jcc.21287. PMID:{' '}
        <Link to="https://pubmed.ncbi.nlm.nih.gov/19444816/">19444816</Link>; PMCID:
        PMC2810661.
      </Typography>
      <Typography variant="body2" sx={{ mx: 2, my: 2 }}>
        Schneidman-Duhovny D, Hammel M, Tainer JA, Sali A.{' '}
        <b>
          Accurate SAXS profile computation and its assessment by contrast variation
          experiments.
        </b>{' '}
        Biophys J. 2013 Aug 20;105(4):962-74. doi: 10.1016/j.bpj.2013.07.020. PMID:{' '}
        <Link to="https://pubmed.ncbi.nlm.nih.gov/23972848/">23972848</Link>; PMCID:
        PMC3752106.
      </Typography>
      <Typography variant="body2" sx={{ mx: 2, my: 2 }}>
        Schneidman-Duhovny D, Hammel M, Tainer JA, Sali A.{' '}
        <b>
          FoXS, FoXSDock and MultiFoXS: Single-state and multi-state structural modeling
          of proteins and their complexes based on SAXS profiles.
        </b>{' '}
        Nucleic Acids Res. 2016 Jul 8;44(W1):W424-9. doi: 10.1093/nar/gkw389. Epub 2016
        May 5. PMID: <Link to="https://pubmed.ncbi.nlm.nih.gov/27151198/">27151198</Link>;
        PMCID: PMC4987932.
      </Typography>
      <Typography>
        Other projects and code that powers the AlphaFold PAE Jiffy to automatically
        create a CHARMM <code>const.inp</code> file:
      </Typography>
      <ul>
        <li>
          <Link to="https://github.com/google-deepmind/alphafold">AlphaFold</Link>
        </li>
        <li>
          <Link to="https://python.igraph.org/en/stable/">igraph</Link>
        </li>
        <li>
          <Link to="https://numpy.org/">NumPy</Link>
        </li>
      </ul>
    </>
  )

  return content
}

export default Welcome
