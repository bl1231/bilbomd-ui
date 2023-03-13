import React, { useState } from 'react'
import { Button, FormControl, FormHelperText, FormLabel, Input } from '@mui/material'

const FileInput = (props) => {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (event) => {
    event.preventDefault()
    props.setFieldTouched(props.name, true, true)
    let reader = new FileReader()
    let file = event.target.files[0]
    if (file) {
      reader.onloadend = () => setFileName(file.name)
      reader.readAsDataURL(file)
      props.setFieldValue(props.name, file)
    }
  }

  return (
    <FormControl margin="normal">
      <FormLabel sx={{ marginBottom: '0.6em' }}>
        Upload your <b>{props.fileType}</b> file
      </FormLabel>
      <Input
        style={{ display: 'none' }}
        id={props.id}
        name={props.name}
        type="file"
        accept={props.fileExt}
        onChange={handleFileChange}
        // onBlur={(e) => {
        //   console.log('onBlur triggered', e)
        // }}
        // {...props}
      />
      <label htmlFor={props.id}>
        <Button variant="contained" component="span" sx={{ mr: 2, width: '100px' }}>
          {props.title}
        </Button>
      </label>
      {fileName && !props.errorMessage ? (
        <FormHelperText sx={{ ml: 0, color: '#389e0d', fontSize: 16 }}>
          {fileName}
        </FormHelperText>
      ) : null}
      {props.error ? (
        <FormHelperText sx={{ ml: 0, color: '#cf1322', fontSize: 16 }} error={true}>
          {props.errorMessage}
        </FormHelperText>
      ) : null}
    </FormControl>
  )
}

export default FileInput
