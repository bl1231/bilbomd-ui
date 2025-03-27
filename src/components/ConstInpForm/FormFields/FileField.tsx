import { useState, ChangeEvent } from 'react'
import {
  Button,
  FormControl,
  FormControlProps,
  Input,
  Alert
} from '@mui/material'
import Grid from '@mui/material/Grid'

interface FileFieldProps extends FormControlProps {
  id: string
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  title: string
  isError: boolean
  errorMessage: string
  fileExt: string
  setFieldValue: (field: string, value: File, shouldValidate?: boolean) => void
}

const FileField = ({
  id,
  name,
  title,
  isError,
  errorMessage,
  fileExt,
  setFieldValue,
  onChange
}: FileFieldProps) => {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const reader = new FileReader()
    const file = event.target.files?.[0]
    if (file) {
      reader.onloadend = () => setFileName(file.name)
      reader.readAsDataURL(file)
      setFieldValue(name, file)
      if (onChange) {
        onChange(event)
      }
    }
  }
  return (
    <FormControl error={isError}>
      {/* <FormLabel>test</FormLabel> */}
      <Grid container spacing={2} alignItems='center'>
        <Grid>
          <Input
            style={{ display: 'none' }}
            id={id}
            name={name}
            type='file'
            onChange={handleFileChange}
            inputProps={{ accept: fileExt }}
          />
          <label htmlFor={id}>
            <Button
              variant='contained'
              component='span'
              sx={{
                height: '40px',
                width: '160px',
                fontSize: '1.1rem',
                alignItems: 'center'
              }}
            >
              {title}
            </Button>
          </label>
        </Grid>
        <Grid>
          {fileName && !errorMessage ? (
            <Alert
              variant='outlined'
              severity='success'
              sx={{
                height: '55px',
                fontSize: '1.1rem',
                alignItems: 'center'
              }}
            >
              {fileName}
            </Alert>
          ) : null}
          {isError ? (
            <Alert
              severity='error'
              sx={{
                height: '55px',
                fontSize: '1.1rem',
                alignItems: 'center'
              }}
            >
              {errorMessage}
            </Alert>
          ) : null}
        </Grid>
        {/* <Grid item>
          {fileName && !errorMessage ? (
            <Alert variant="outlined" severity="info" sx={{ py: 0 }}>
              {fileName}
            </Alert>
          ) : null}
        </Grid> */}
      </Grid>
    </FormControl>
  )
}

export default FileField
