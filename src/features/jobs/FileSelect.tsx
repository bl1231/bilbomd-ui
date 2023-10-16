import { useState, ChangeEvent } from 'react'
import {
  Button,
  FormControl,
  FormControlProps,
  Grid,
  Input,
  FormLabel,
  Alert
} from '@mui/material'

interface FileSelectProps extends FormControlProps {
  fileType: string
  fileExt: string
  id: string
  name: string
  title: string
  errorMessage?: string
  setFieldValue: (field: string, value: File, shouldValidate?: boolean) => void
  onFileChange: (file: File) => void
}

const FileSelect = (props: FileSelectProps) => {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const reader = new FileReader()
    const file = event.target.files?.[0]
    if (file) {
      reader.onloadend = () => setFileName(file.name)
      reader.readAsDataURL(file)
      props.setFieldValue(props.name, file)
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
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Input
            style={{ display: 'none' }}
            id={props.id}
            name={props.name}
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor={props.id}>
            <Button variant="contained" component="span" sx={{ width: '110px' }}>
              {props.title}
            </Button>
          </label>
        </Grid>
        <Grid item>
          {fileName && !props.errorMessage ? (
            <Alert variant="outlined" severity="success" sx={{ py: 0 }}>
              {fileName}
            </Alert>
          ) : null}
          {props.error ? (
            <Alert severity="error" sx={{ py: 0 }}>
              {props.errorMessage}
            </Alert>
          ) : null}
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default FileSelect
