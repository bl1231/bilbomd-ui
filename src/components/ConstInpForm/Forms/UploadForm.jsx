import React, { useState, useEffect, useRef } from 'react'
import { Field, useField, useFormikContext } from 'formik'
import { Alert, Button, Grid, Typography } from '@mui/material'
// import { UploadField } from '../FormFields/UploadField'
import CrdFileField from '../FormFields/CrdFileField'
// import FileInput from 'features/jobs/FileInput'
// import Thumb from '../common/Thumb'
import CrdSummary from '../Helpers/CrdSummary'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px'
}

const UploadForm = ({ setStepIsValid }) => {
  useTitle('BilboMD: Create const.inp file')

  const { resetForm, isValid } = useFormikContext()

  const [field, meta, helper] = useField('crd_file')
  const { value } = field
  const { touched, error } = meta
  const { setValue, setTouched } = helper
  const isError = touched && error

  const [fileName, setFileName] = useState(value.name)
  const [file, setFile] = useState(value.file)
  const [src, setSrc] = useState(value.src)
  const [chains, setChains] = useState(value.chains)

  const parseCrdFile = () => {
    // setFileName('')
    // setFile('')
    // setSrc('')
    // setChains('')
    // setError('')
    setValue({
      file: file,
      src: src,
      name: fileName,
      chains: chains
    })

    const loi =
      /^\s*(?:\d+\s+){2}(?:\S+\s+){2}(?:\d+\.\d+\s+){3}(?:\D+\s+){1}(?:\d+\s+){1}(?:\d+\.\d+){1}$/gm
    const data = src.result.match(loi)
    if (!data) return
    // console.log('data:', data)
    // data is now an Array so grab 8th item from every element. use map?
    const allChainIds = data.map((line) => {
      const items = line.split(/\s+/)
      return items[8]
    })
    const uniqueChains = allChainIds.filter(
      (value, index, array) => array.indexOf(value) === index
    )
    // console.log(uniqueChains)
    let charmmChains = []
    uniqueChains.forEach((chainId, i) => {
      // console.log('chainID:', chainId)
      const chainArray = data.filter((value) => value.includes(chainId))
      let length = chainArray.length
      let firstLine = chainArray[0]
      let lastLine = chainArray[length - 1]
      // console.log('num atoms:', length)
      // console.log('firstLine:', firstLine)
      // console.log('lastLine:', lastLine)
      let firstRes = firstLine.split(/\s+/)[9]
      let lastRes = lastLine.split(/\s+/)[9]
      let numResidues = lastRes - firstRes
      // console.log('first res:', firstRes)
      // console.log('last res:', lastRes)
      // console.log('num res:', numResidues)
      let charmmChain = {
        id: chainId,
        atoms: length,
        first_res: firstRes,
        last_res: lastRes,
        num_res: numResidues,
        domains: [{ start: firstRes, end: lastRes }]
      }
      charmmChains.push(charmmChain)
    })

    // setValue with new chains objects
    // console.log(charmmChains)
    setChains(charmmChains)

    // setValue({
    //   file: file,
    //   src: src,
    //   name: fileName,
    //   chains: chains
    // })
  }

  const onChange = async (event) => {
    console.log('onChange triggered')
    setTouched()
    let file = event.target.files[0]
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

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // console.log('in useEffect')
      if (file && fileName && src && chains) {
        // console.log('useEffect:', src)

        parseCrdFile()
        // console.log('valid:', isValid)
        // setStepIsValid(isValid)
      }
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fileName, file, chains[0]?.id])

  useEffect(() => {
    // not exactly sure of best place for this.
    // Need to update parent of isValid so we can enable/disable the "NEXT" button
    // console.log('valid:', isValid)
    setStepIsValid(isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid])

  return (
    <React.Fragment>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Instructions</Typography>
          <Item>
            <Typography variant="h4" sx={{ m: 1 }}>
              Select a *CRD file to upload
            </Typography>
            <Typography sx={{ m: 1 }}>
              <b>BilboMD</b> uses <a href="https://academiccharmm.org/">CHARMM</a> to
              generate an ensemble of molecular models. In order for the Molecular
              Dynamics steps to run successfully it is imperative that the rigid and
              flexible regions of your molecule are defined in proper CHARMM{' '}
              <a href="https://academiccharmm.org/documentation/version/c47b2/select">
                atom selection
              </a>{' '}
              syntax. This web jiffy should help you get started. You will need to use the{' '}
              <b>PDB Reader</b> tool available from{' '}
              <a href="https://www.charmm-gui.org/">CHARMM-GUI</a> to convert your PDB
              file to CRD. You will need to register for a account before you can use
              CHARMM-GUI tools.
            </Typography>
            <Typography sx={{ m: 1 }}>
              Example{' '}
              <b>
                <code>const.inp</code>
              </b>{' '}
              file:
            </Typography>
            <Box sx={{ backgroundColor: '#f0f0f0', m: 1, p: 1 }}>
              <Typography
                component="pre"
                sx={{
                  m: 1,
                  fontFamily:
                    'Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New;'
                }}
              >
                define fixed1 sele ( resid 40:137 .and. segid PROA ) end
                <br />
                define fixed2 sele ( resid 150:203 .and. segid PROA ) end
                <br />
                define fixed3 sele ( segid DNAA ) end
                <br />
                define fixed4 sele ( segid DNAB ) end
                <br />
                cons fix sele fixed1 .or. fixed2 .or. fixed3 .or. fixed4 end
                <br />
                return
              </Typography>
            </Box>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>File Upload</Typography>
          <Item>
            <Grid container direction="column">
              <Grid item xs={6}>
                <Field
                  name="crd_file"
                  id="crd_file"
                  title="Select File"
                  variant="outlined"
                  // field={field}
                  as={CrdFileField}
                  onChange={onChange}
                  isError={Boolean(error && touched)}
                  error={error}
                  errorMessage={isError ? error : ''}
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => {
                    console.log('reset Form')
                    setFileName('')
                    setFile('')
                    setSrc('')
                    setChains('')
                    resetForm()
                    setStepIsValid(false)
                  }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item>
                {isError ? (
                  <Alert severity="error" sx={{ my: 1 }}>
                    <Typography>{error.file}</Typography>
                  </Alert>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Item>
        </Grid>
        {fileName && !error ? (
          <Grid item xs={12}>
            <Typography sx={HeaderThingee}>Summary</Typography>

            <Item>
              <Typography variant="h4" sx={{ my: 2 }}>
                {fileName}
              </Typography>
              {file && src && chains && <CrdSummary chains={chains}></CrdSummary>}
            </Item>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </React.Fragment>
  )
}

export default UploadForm
