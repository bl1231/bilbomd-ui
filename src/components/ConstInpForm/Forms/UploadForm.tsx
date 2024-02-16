import { ChangeEvent, useEffect } from 'react'
import { Field, useFormikContext } from 'formik'
import { Grid, Typography, Link } from '@mui/material'
import * as PropTypes from 'prop-types'
import FileField from '../FormFields/FileField'
import CrdSummary from '../Helpers/CrdSummary'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import { Chain, RigidBody, Atom } from 'types/interfaces'
import HeaderBox from 'components/HeaderBox'

interface AtomsByChain {
  [chainId: string]: Atom[]
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

const UploadForm = ({ setStepIsValid }) => {
  useTitle('BilboMD: Upload PDB file')
  const theme = useTheme()
  const { values, setFieldValue, setFieldError, isValid, errors } =
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
        setFieldError('pdb_file.file', 'Invalid PDB file: No ATOM/HETATM records found.')
        return // Exit the function early
      }
      atomLines = src.split('\n').filter((line) => line.startsWith('ATOM'))
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

    const uniqueChains = [...new Set(atoms.map((atom) => atom.chainID))]
    console.log('Unique Chains:', uniqueChains)

    const charmmChains: Chain[] = []
    const demRigidBodies: RigidBody[] = [{ id: 'PRIMARY', domains: [] }]

    const atomsByChain: AtomsByChain = atoms.reduce((acc: AtomsByChain, atom: Atom) => {
      const { chainID } = atom
      if (!acc[chainID]) {
        acc[chainID] = []
      }
      acc[chainID].push(atom)
      return acc
    }, {})

    Object.entries(atomsByChain).forEach(([chainId, atoms]) => {
      // Ensure atoms are sorted by their residue sequence number
      const sortedAtoms = atoms.sort((a, b) => a.resSeq - b.resSeq)

      const firstAtom = sortedAtoms[0]
      const lastAtom = sortedAtoms[sortedAtoms.length - 1]

      // Use nullish coalescing or other type-safe operations to handle potential undefined values
      const firstRes: number = firstAtom?.resSeq ?? 0
      const lastRes: number = lastAtom?.resSeq ?? 0
      const numResidues: number = lastRes - firstRes + 1

      const charmmChain: Chain = {
        id: chainId,
        atoms: sortedAtoms.length,
        first_res: firstRes,
        last_res: lastRes,
        num_res: numResidues,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  useEffect(() => {
    setStepIsValid(isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <HeaderBox>
            <Typography>Instructions</Typography>
          </HeaderBox>

          <Paper sx={{ p: 1 }}>
            <Typography variant="h4" sx={{ m: 1 }}>
              Select a PDB file to upload
            </Typography>
            <Typography sx={{ m: 1 }}>
              <b>BilboMD</b> uses{' '}
              <Link
                href="https://academiccharmm.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CHARMM
              </Link>{' '}
              to generate an ensemble of molecular models. In order for the Molecular
              Dynamics steps to run successfully you must define the rigid and flexible
              regions of your molecule using proper CHARMM{' '}
              <Link
                href="https://academiccharmm.org/documentation/version/c47b2/select"
                target="_blank"
                rel="noopener noreferrer"
              >
                atom selection
              </Link>{' '}
              syntax.
            </Typography>
            <Typography sx={{ m: 1 }}>
              Example{' '}
              <b>
                <code>const.inp</code>
              </b>{' '}
              file:
            </Typography>
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
                component="pre"
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
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <HeaderBox>
            <Typography>File Upload</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            <Grid container direction="column">
              <Grid item xs={6}>
                <Field
                  name="pdb_file"
                  id="pdb_file"
                  title="Select PDB File"
                  as={FileField}
                  onChange={onChange}
                  isError={Boolean(errors.pdb_file)}
                  errorMessage={
                    errors.pdb_file ? errors.pdb_file.file || 'Error uploading file' : ''
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {name && (!errors.pdb_file || !errors.pdb_file.file) ? (
          <Grid item xs={12}>
            <HeaderBox>
              <Typography>Summary</Typography>
            </HeaderBox>

            <Paper sx={{ p: 1 }}>
              <Typography variant="h4" sx={{ my: 2 }}>
                PDB Filename: {name}
              </Typography>
              <CrdSummary chains={chains}></CrdSummary>
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
