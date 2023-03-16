import React, { useState, useEffect, useRef } from 'react'
import { Field, useField, validateYupSchema } from 'formik'
import { Grid, Typography, FormHelperText } from '@mui/material'
import { UploadField } from '../FormFields/UploadField'
// import Thumb from '../common/Thumb'
import CrdSummary from '../Helpers/CrdSummary'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'

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

    // grab 7th column = chain IDs
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
    // setChains(unique)
    console.log('unique chains', uniqueChains)
    // Want to construct a chain object
    // { id: 'PROA', length: 236 }
    //
    // Put each chainid in seperate object
    // look for contoguous segments
    // report first residue #
    // report last  residue #
    // reposrt total length
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
        num_res: numResidues
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

  const _onChange = (event) => {
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
            <Typography variant="h4" sx={{ ml: 1 }}>
              Select a *CRD file to upload
            </Typography>
            <p>
              Instructions here. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.
            </p>
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
                onChange={_onChange}
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
