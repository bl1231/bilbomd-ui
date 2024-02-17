import { useState, ChangeEvent } from 'react'
import { Button, FormControl, FormControlProps, Input, Grid, Alert } from '@mui/material'

interface FileFieldProps extends FormControlProps {
  id: string
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  title: string
  isError: boolean
  errorMessage: string
  setFieldValue: (field: string, value: File, shouldValidate?: boolean) => void
}

const FileField = ({
  id,
  name,
  title,
  isError,
  errorMessage,
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
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Input
            style={{ display: 'none' }}
            id={id}
            name={name}
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor={id}>
            <Button
              variant="contained"
              component="span"
              sx={{ width: '150px' }}
              size="large"
            >
              {title}
            </Button>
          </label>
        </Grid>
        <Grid item>
          {fileName && !errorMessage ? (
            <Alert variant="outlined" severity="success" sx={{ py: 0 }}>
              {fileName}
            </Alert>
          ) : null}
          {isError ? (
            <Alert severity="error" sx={{ py: 0 }}>
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
