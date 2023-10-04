import { useState, ChangeEvent } from 'react'
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  FormControlProps
} from '@mui/material'

interface FileInputProps extends FormControlProps {
  fileType: string
  fileExt: string
  id: string
  name: string
  title: string
  errorMessage?: string
  // error?: boolean
  // setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => void
  setFieldValue: (field: string, value: File, shouldValidate?: boolean) => void
  onFileChange: (file: File) => void
}

const FileInput = (props: FileInputProps) => {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    // props.setFieldTouched(props.name, true, true)
    const reader = new FileReader()
    const file = event.target.files?.[0]
    if (file) {
      reader.onloadend = () => setFileName(file.name)
      reader.readAsDataURL(file)
      props.setFieldValue(props.name, file)
      // Call the callback function provided by the calling component
      // This allows us to trigger a callback function to analyze SAXS data with AutoRG
      if (props.onFileChange) {
        props.onFileChange(file)
      }
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
        onChange={handleFileChange}
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
