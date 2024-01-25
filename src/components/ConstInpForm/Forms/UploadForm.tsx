import { useState, useEffect } from 'react'
import { Field, useField, useFormikContext } from 'formik'
import { Alert, Grid, Typography, Link } from '@mui/material'
import * as PropTypes from 'prop-types'
import CrdFileField from '../FormFields/CrdFileField'
import CrdSummary from '../Helpers/CrdSummary'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import { Chain, RigidBody } from 'types/interfaces'
import HeaderBox from 'components/HeaderBox'

const UploadForm = ({ setStepIsValid }) => {
  useTitle('BilboMD: Upload CRD file')
  const theme = useTheme()
  const { isValid } = useFormikContext()
  const [field, meta, helper] = useField('crd_file')
  const { value } = field
  const { touched, error } = meta
  const { setValue } = helper
  const isError = touched && error
  const [fileName, setFileName] = useState<string>(value.name)
  const [file, setFile] = useState<File | undefined>(value.file)
  const [src, setSrc] = useState<FileReader | null>(value.src)
  const [chains, setChains] = useState<Chain[]>(value.chains)
  const [rigidBodies, setRigidBodies] = useState<RigidBody[]>(value.rigid_bodies)

  const parseCrdFile = () => {
    setValue({
      file: file,
      src: src,
      name: fileName,
      chains: chains,
      rigid_bodies: rigidBodies
    })

    const loi =
      /^\s*(?:\d+\s+){2}(?:\S+\s+){2}(?:[+-]?\d+\.\d+\s+){3}(?:\D+\s+){1}(?:\d+\s+){1}(?:\d+\.\d+){1}$/gm

    let data: RegExpMatchArray | null = null
    // let data: RegExpMatchArray
    if (src !== null && typeof src.result === 'string') {
      data = src.result.match(loi)
    }
    if (!data) return
    // console.log('data:', data)
    // data is now an Array so grab 8th item from every element. use map?
    // console.time('get unique chains')
    const allChainIds: string[] = data.map((line: string) => {
      //console.log(line)
      const items = line.split(/\s+/)
      return items[8]
    })

    const uniqueChains: string[] = [...new Set(allChainIds)]
    // console.log('uniqueChains', uniqueChains)
    const charmmChains: Chain[] = []
    const demRigidBodies: RigidBody[] = [{ id: 'PRIMARY', domains: [] }]

    uniqueChains.forEach((chainId) => {
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      const filteredData = data!.filter((line) => line.includes(chainId))

      const length = filteredData.length
      const firstLine = filteredData[0]
      const lastLine = filteredData[length - 1]
      const firstRes = Number(firstLine.split(/\s+/)[9])
      const lastRes = Number(lastLine.split(/\s+/)[9])
      const numResidues = lastRes - firstRes
      const charmmChain: Chain = {
        id: chainId,
        atoms: length,
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
    setChains(charmmChains)
    setRigidBodies(demRigidBodies)
  }

  const onChange = async (event) => {
    // setTouched()
    const file = event.target.files[0]
    const filePromise = new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const result = await reader.DONE
          setSrc(reader)
          setFile(file)
          setFileName(file.name)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsText(file)
    })
    await filePromise
  }

  useEffect(() => {
    if (file && fileName && src && chains) {
      parseCrdFile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fileName, file, chains[0]?.id])

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
              Select a *CRD file to upload
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
              Dynamics steps to run successfully it is imperative that the rigid and
              flexible regions of your molecule are defined in proper CHARMM{' '}
              <Link
                href="https://academiccharmm.org/documentation/version/c47b2/select"
                target="_blank"
                rel="noopener noreferrer"
              >
                atom selection
              </Link>{' '}
              syntax. This web jiffy should help you get started. You will need to use the{' '}
              <b>PDB Reader</b> tool available from{' '}
              <Link
                href="https://www.charmm-gui.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CHARMM-GUI
              </Link>{' '}
              to convert your PDB file to CRD. You will need to register for a account
              before you can use CHARMM-GUI tools.
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
                define rigid1 sele ( resid 8:155 .and. segid PROA ) end
                <br />
                shape desc dock1 rigid sele rigid1 end
                <br />
                define rigid1 sele ( resid 51:79 .and. segid PROB ) end
                <br />
                shape desc dock2 rigid sele rigid1 end
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
                  name="crd_file"
                  id="crd_file"
                  title="Select CRD File"
                  // variant="outlined"
                  // field={field}
                  as={CrdFileField}
                  onChange={onChange}
                  isError={Boolean(error && touched)}
                  error={error}
                  errorMessage={isError ? error : ''}
                />
              </Grid>
              <Grid item>
                {isError ? (
                  <Alert severity="error" sx={{ my: 1 }}>
                    <Typography>ERROR</Typography>
                  </Alert>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {fileName && !error ? (
          <Grid item xs={12}>
            <HeaderBox>
              <Typography>Summary</Typography>
            </HeaderBox>

            <Paper sx={{ p: 1 }}>
              <Typography variant="h4" sx={{ my: 2 }}>
                CRD Filename: {fileName}
              </Typography>
              {file && src && chains && <CrdSummary chains={chains}></CrdSummary>}
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
