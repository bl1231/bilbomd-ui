import React, { useState, useEffect } from 'react'
import { Field, useField } from 'formik'
import { Grid, FormHelperText } from '@mui/material'
import { UploadField } from '../FormFields/UploadField'
// import Thumb from '../common/Thumb'
import CrdSummary from '../Helpers/CrdSummary'

const UploadForm = (props) => {
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
  const _onChange = (e) => {
    let reader = new FileReader()
    let file = e.target.files[0]
    if (file) {
      reader.onload = () => {
        setFileName(file.name)
        setSrc(reader)
        setFile(file)
      }
      if (file.name !== fileName) {
        // reader.readAsDataURL(file)
        reader.readAsText(file)
        // setSrc(reader)
        // setFile(file)
      }
    }
  }

  useEffect(() => {
    if (file && fileName && src) {
      setValue({ file: file, src: src, name: fileName })
      console.log(file)
      console.log(src)
      console.log(fileName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fileName, file])

  return (
    <React.Fragment>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12}>
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
        </Grid>

        <Grid item>{file && src && <CrdSummary file={file} src={src}></CrdSummary>}</Grid>
        <Field type="text" field={field} name="hiddentest" id="hiddentest" />
      </Grid>
    </React.Fragment>
  )
}

export default UploadForm
