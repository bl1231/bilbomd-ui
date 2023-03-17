import React, { useState, useEffect, useRef } from 'react'
import { Field, useField, validateYupSchema } from 'formik'
import { Grid, Typography, FormHelperText } from '@mui/material'
import { UploadField } from '../FormFields/UploadField'
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

const UploadForm = (props) => {
  useTitle('BilboMD: Create const.inp file')
  const {
    formField: { crdFile }
  } = props

  const [field, meta, helper] = useField(crdFile.name)
  const { touched, error } = meta
  const { setValue } = helper
  const isError = touched && error && true
  const { value } = field

  const [fileName, setFileName] = useState(value.name)
  const [file, setFile] = useState(value.file)
  const [src, setSrc] = useState(value.src)
  //const [lines, setLines] = useState()
  const [chains, setChains] = useState(value.chains)
  // const [domains, setDomains] = useState(value.domains)

  const parseCrdFile = () => {
    console.log('src', src)
    console.log('file', file)

    // split on newline and carrage return
    let lines = src.result.split(/[\r\n]+/g)

    // CRD file: 7th column = chain IDs
    const chainId = /^\s*(?:\S+\s+){7}(\S+)/

    const allChainIds = []
    for (let line = 5; line < lines.length - 1; line++) {
      let id = chainId.exec(lines[line])[1]
      //   console.log(id)
      allChainIds.push(id)
    }

    const uniqueChains = allChainIds.filter(
      (value, index, array) => array.indexOf(value) === index
    )

    console.log('unique chains', uniqueChains)

    let group = []
    let charmmChains = []
    uniqueChains.forEach((element, i) => {
      console.log('chainID:', element)
      const re = new RegExp('(.+' + element + '.+)')
      // console.log(re)
      let c = []
      for (let line = 5; line < lines.length - 1; line++) {
        let item = re.exec(lines[line])
        if (item !== null) {
          // console.log(item)
          c.push(item[0])
        }
      }

      group[i] = c
      // CRD file: 8th column = Residue Number
      const residueNumber = /^\s*(?:\S+\s+){8}(\S+)/
      let length = group[i].length
      let firstLine = group[i][0]
      let lastLine = group[i][length - 1]
      console.log('num atoms:', length)
      // console.log('firstLine:', firstLine)
      // console.log('lastLine:', lastLine)
      let firstRes = residueNumber.exec(firstLine)[1]
      let lastRes = residueNumber.exec(lastLine)[1]
      let numResidues = lastRes - firstRes
      console.log('first res:', firstRes)
      console.log('last res:', lastRes)
      console.log('num res:', numResidues)
      let charmmChain = {
        id: element,
        atoms: length,
        first_res: firstRes,
        last_res: lastRes,
        num_res: numResidues,
        domains: [{ id: element, start: firstRes, end: lastRes }]
      }
      charmmChains.push(charmmChain)
    })

    // setValue with new chains objects
    // console.log(charmmChains)
    setChains(charmmChains)

    setValue({
      file: file,
      src: src,
      name: fileName,
      chains: chains
    })
  }

  const onChange = (event) => {
    console.log('onChange triggered')
    let reader = new FileReader()
    let file = event.target.files[0]

    if (file) {
      console.log(file)
      reader.onloadend = () => {
        setFileName(file.name)
        console.log('fileName:', fileName)
        // setSrc(reader)
        // console.log('src:', src)
        // setFile(file)
      }
      if (file.name !== fileName) {
        console.log('reading file', file.name)
        reader.readAsText(file)
        setSrc(reader)
        setFile(file)
      }
    }
  }

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      if (file && fileName && src && chains) {
        // setValue({
        //   file: file,
        //   src: src,
        //   name: fileName,
        //   chains: chains
        // })
        parseCrdFile()
      }
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fileName, file, chains[0].id])

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
              <a href="https://www.charmm-gui.org/">CHARMM-GUI</a>. You will need to
              register for a account before you can use CHARMM-GUI tools.
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
                define fixed1 sele ( resid 40:137 .and. segid PROA) end
                <br />
                define fixed2 sele ( resid 150:203 .and. segid PROA) end
                <br />
                define fixed3 sele ( segid DNAA) end
                <br />
                define fixed4 sele ( segid DNAB) end
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
            <label style={{ color: `${isError ? 'red' : 'var(--main-color)'}` }}>
              {crdFile.label}
            </label>
            <br />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                fontSize: '1.2em'
              }}
            >
              <Field
                variant="outlined"
                field={field}
                component={UploadField}
                onChange={onChange}
                isError={isError}
              />
              {isError && <FormHelperText color={'red'}>{error}</FormHelperText>}
            </div>
          </Item>
        </Grid>
        {fileName ? (
          <Grid item xs={12}>
            <Typography sx={HeaderThingee}>Summary</Typography>

            <Item>
              <Typography variant="h4" sx={{ my: 2 }}>
                {fileName}
              </Typography>
              {file && src && chains && (
                <CrdSummary file={file} src={src} chains={chains}></CrdSummary>
              )}
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
