import { ChangeEvent, useEffect } from 'react'
import { Field, useFormikContext } from 'formik'
import {
  Typography,
  Link,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import * as PropTypes from 'prop-types'
import FileField from '../FormFields/FileField'
import ChainSummary from '../Helpers/ChainSummary'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import { Chain, RigidBody, Atom } from 'types/interfaces'
import HeaderBox from 'components/HeaderBox'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
interface AtomsByChain {
  [chainId: string]: Atom[]
}
interface ResidueAtomNames {
  [key: string]: string[] // Each key is a residue identifier, mapping to an array of atom names
}
interface MyFormValues {
  pdb_file: {
    file: File | null
    src: string | null
    name: string
    chains: Chain[]
    rigid_bodies: RigidBody[]
  }
}
const proteinResidues = new Set([
  'ALA',
  'CYS',
  'ASP',
  'GLU',
  'PHE',
  'GLY',
  'HIS',
  'ILE',
  'LYS',
  'LEU',
  'MET',
  'ASN',
  'PRO',
  'GLN',
  'ARG',
  'SER',
  'THR',
  'VAL',
  'TRP',
  'TYR'
])
const dnaResidues = new Set([
  'DA',
  'DC',
  'DG',
  'DT',
  'DU',
  'ADE',
  'CYT',
  'GUA',
  'THY'
]) // Deoxyribonucleotides
// const rnaResidues = new Set(['A', 'C', 'G', 'U', 'URA']) // Ribonucleotides
const carbResidues = new Set([
  'AFL',
  'ALL',
  'BMA',
  'BGC',
  'BOG',
  'FCA',
  'FCB',
  'FMF',
  'FUC',
  'FUL',
  'G4S',
  'GAL',
  'GLA',
  'GLB',
  'GLC',
  'GLS',
  'GSA',
  'LAK',
  'LAT',
  'MAF',
  'MAL',
  'NAG',
  'NAN',
  'NGA',
  'SIA',
  'SLB'
])

const UploadForm = ({
  setStepIsValid
}: {
  setStepIsValid: (isValid: boolean) => void
}) => {
  useTitle('BilboMD: Upload PDB file')
  const theme = useTheme()
  const { values, setFieldValue, setFieldError, isValid, dirty, errors } =
    useFormikContext<MyFormValues>()
  const { name, src, chains, rigid_bodies } = values.pdb_file

  const parsePdbFile = () => {
    const src = values.pdb_file.src
    let atomLines: string[] = []

    if (src !== null && typeof src === 'string') {
      // Preliminary check for ATOM lines to validate PDB file format
      const hasValidAtomLines = src
        .split('\n')
        .some((line) => line.startsWith('ATOM') || line.startsWith('HETATM'))

      if (!hasValidAtomLines) {
        // Handle invalid file format (e.g., set an error state, show a message)
        setFieldError(
          'pdb_file.file',
          'Invalid PDB file: No ATOM/HETATM records found.'
        )
        return
      }
      atomLines = src
        .split('\n')
        .filter((line) => line.startsWith('ATOM') || line.startsWith('HETATM'))
    }

    const atoms: Atom[] = atomLines.map((line) => {
      return {
        serial: parseInt(line.substring(6, 11).trim()),
        name: line.substring(12, 16).trim(),
        altLoc: line.substring(16, 17).trim(),
        resName: line.substring(17, 20).trim(),
        chainID: line.substring(21, 22).trim(),
        resSeq: parseInt(line.substring(22, 26).trim()),
        iCode: line.substring(26, 27).trim(),
        x: parseFloat(line.substring(30, 38).trim()),
        y: parseFloat(line.substring(38, 46).trim()),
        z: parseFloat(line.substring(46, 54).trim()),
        occupancy: parseFloat(line.substring(54, 60).trim()),
        tempFactor: parseFloat(line.substring(60, 66).trim()),
        element: line.substring(76, 78).trim(),
        charge: line.substring(78, 80).trim()
      }
    })
    // Check if any atom does not have a chainID
    const hasInvalidChainID = atoms.some((atom) => !atom.chainID)

    if (hasInvalidChainID) {
      setFieldError(
        'pdb_file.file',
        'One or more atoms in the PDB file do not have a chain ID.'
      )
      return
    }

    const charmmChains: Chain[] = []
    const demRigidBodies: RigidBody[] = [{ id: 'PRIMARY', domains: [] }]

    const atomsByChain: AtomsByChain = atoms.reduce(
      (acc: AtomsByChain, atom: Atom) => {
        const { chainID } = atom
        if (!acc[chainID]) {
          acc[chainID] = []
        }
        acc[chainID].push(atom)
        return acc
      },
      {}
    )

    Object.entries(atomsByChain).forEach(([chainId, atoms]) => {
      // Ensure atoms are sorted by their residue sequence number
      const sortedAtoms = atoms.sort((a, b) => a.resSeq - b.resSeq)

      const firstAtom = sortedAtoms[0]
      const lastAtom = sortedAtoms[sortedAtoms.length - 1]

      // Use nullish coalescing or other type-safe operations to handle potential undefined values
      const firstRes: number = firstAtom?.resSeq ?? 0
      const lastRes: number = lastAtom?.resSeq ?? 0
      const numResidues: number = lastRes - firstRes + 1

      // Collect atom names for each residue within the chain
      const residueAtomNames = atoms.reduce(
        (acc: ResidueAtomNames, atom: Atom) => {
          const key = `${atom.resName}-${atom.resSeq}`
          if (!acc[key]) acc[key] = []
          acc[key].push(atom.name)
          return acc
        },
        {}
      )

      // Determine chain type
      let chainType = 'Other'
      const resNames = new Set(atoms.map((atom) => atom.resName))

      // Calculate the fraction or percentage of residues that have an O2' atom
      const fractionOfResiduesWithO2Prime =
        Object.values(residueAtomNames).filter((names) => names.includes("O2'"))
          .length / Object.values(residueAtomNames).length

      // Determine if "most" residues have an O2' atom, e.g., more than 50%
      const mostResiduesHaveO2Prime = fractionOfResiduesWithO2Prime > 0.5

      if (mostResiduesHaveO2Prime) {
        chainType = 'RNA'
      } else if (
        Array.from(resNames).some((resName) => proteinResidues.has(resName))
      ) {
        chainType = 'PRO'
      } else if (
        Array.from(resNames).some((resName) => dnaResidues.has(resName))
      ) {
        chainType = 'DNA'
      } else if (
        Array.from(resNames).some((resName) => carbResidues.has(resName))
      ) {
        chainType = 'CAR'
      }

      const charmmChain: Chain = {
        id: chainId,
        atoms: sortedAtoms.length,
        first_res: firstRes,
        last_res: lastRes,
        num_res: numResidues,
        type: chainType,
        domains: [{ start: firstRes, end: lastRes }]
      }
      charmmChains.push(charmmChain)

      demRigidBodies[0].domains.push({
        chainid: chainId,
        start: firstRes,
        end: lastRes
      })
    })

    // Before updating Formik state, check if new data is different from current state
    if (
      JSON.stringify(chains) !== JSON.stringify(charmmChains) ||
      JSON.stringify(rigid_bodies) !== JSON.stringify(demRigidBodies)
    ) {
      setFieldValue('pdb_file.chains', charmmChains)
      setFieldValue('pdb_file.rigid_bodies', demRigidBodies)
    }
  }

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      if (file) {
        setFieldValue('pdb_file.file', file)
        setFieldValue('pdb_file.name', file.name)
        const reader = new FileReader()
        reader.onload = () => {
          // Ensure reader.result is a string before setting the value
          if (typeof reader.result === 'string') {
            setFieldValue('pdb_file.src', reader.result)
          }
          setFieldValue('pdb_file.name', file.name)
          setFieldValue('pdb_file.file', file)
        }
        reader.onerror = (error) => {
          console.error('File reading error:', error)
        }
        reader.readAsText(file)
      }
    }
  }

  useEffect(() => {
    if (src) {
      parsePdbFile()
    }
  }, [src])

  useEffect(() => {
    setStepIsValid(isValid && dirty)
  }, [isValid, dirty])

  const customColors: Record<string, string> = {
    PRO: theme.palette.mode === 'light' ? '#E6A8A8' : '#b76e79',
    DNA: theme.palette.mode === 'light' ? '#E9D8A6' : '#b3a272',
    RNA: theme.palette.mode === 'light' ? '#B5E3D8' : '#6daba4',
    CAR: theme.palette.mode === 'light' ? '#A8CCE6' : '#6b95b8',
    Other: theme.palette.mode === 'light' ? '#D1A8E6' : '#9773b9'
  }
  const macroMolecules = ['PRO', 'DNA', 'RNA', 'CAR', 'Other']
  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>Instructions</Typography>
          </HeaderBox>

          <Paper sx={{ p: 1 }}>
            <Box>
              <Typography sx={{ m: 1 }}>
                <b>BilboMD</b> uses{' '}
                <Link
                  href='https://academiccharmm.org/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  CHARMM
                </Link>{' '}
                to generate an ensemble of molecular models. In order for the
                Molecular Dynamics steps to run successfully you must define the
                rigid and flexible regions of your molecule using proper CHARMM{' '}
                <Link
                  href='https://academiccharmm.org/documentation/version/c47b2/select'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  atom selection
                </Link>{' '}
                syntax. The <b>inp Jiffy{'\u2122'}</b> will help you construct a
                valid{' '}
                <b>
                  <code>const.inp</code>{' '}
                </b>{' '}
                file: .
              </Typography>
              <ul>
                <li>
                  <Typography>
                    The <b>Inp Jiffy{'\u2122'}</b> will only work with PDB files
                    that have a chain ID (i.e. a single character in column 22
                    ).
                  </Typography>
                </li>
                <li>
                  <Typography>
                    The <b>Inp Jiffy{'\u2122'}</b> will produce a{' '}
                    <b>
                      <code>const.inp</code>{' '}
                    </b>{' '}
                    file with segid names that are compatible with{' '}
                    <b>BilboMD Classic</b>.
                  </Typography>
                </li>
              </ul>
            </Box>

            <Accordion sx={{ backgroundColor: '#f5f5f5' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ m: 1 }}>
                  Example of a{' '}
                  <b>
                    <code>const.inp</code>{' '}
                  </b>{' '}
                  file:{' '}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[600],
                    m: 1,
                    p: 1
                  }}
                >
                  <Typography
                    component='pre'
                    sx={{
                      m: 1,
                      fontFamily:
                        'Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New;'
                    }}
                  >
                    define fixed1 sele ( resid 159:414 .and. segid PROA ) end
                    <br />
                    define fixed2 sele ( resid 94:563 .and. segid PROB ) end
                    <br />
                    cons fix sele fixed1 .or. fixed2 end
                    <br />
                    <br />
                    define rigid1 sele ( resid 8:155 .and. segid PROA ) end
                    <br />
                    shape desc dock1 rigid sele rigid1 end
                    <br />
                    <br />
                    define rigid1 sele ( resid 51:79 .and. segid PROB ) end
                    <br />
                    shape desc dock2 rigid sele rigid1 end
                    <br />
                    <br />
                    return
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>File Upload</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            <Grid container direction='column'>
              <Grid size={{ xs: 6 }}>
                <Field
                  name='pdb_file'
                  id='pdb_file'
                  title='Select PDB File'
                  as={FileField}
                  onChange={onChange}
                  setFieldValue={setFieldValue}
                  isError={Boolean(errors.pdb_file)}
                  errorMessage={
                    errors.pdb_file
                      ? errors.pdb_file.file || 'Error uploading file'
                      : ''
                  }
                  fileExt='.pdb'
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {name && (!errors.pdb_file || !errors.pdb_file.file) && chains ? (
          <Grid size={{ xs: 12 }}>
            <HeaderBox>
              <Typography>Summary</Typography>
            </HeaderBox>

            <Paper sx={{ p: 1 }}>
              <Grid>
                {macroMolecules.map((chain: string, index: number) => (
                  <Chip
                    key={index}
                    label={`${chain}`}
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor: customColors[chain] || '#9773b9',
                      color: theme.palette.getContrastText(customColors[chain])
                    }}
                  />
                ))}
              </Grid>
              <ChainSummary chains={chains}></ChainSummary>
            </Paper>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </>
  )
}

UploadForm.propTypes = {
  setStepIsValid: PropTypes.func.isRequired
}

export default UploadForm
//
