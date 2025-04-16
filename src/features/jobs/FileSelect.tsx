import { ChangeEvent } from 'react'
import {
  Button,
  FormControl,
  FormControlProps,
  Input,
  FormLabel,
  Alert
} from '@mui/material'
import Grid from '@mui/material/Grid'

interface FileSelectProps extends FormControlProps {
  value: File
  fileType: string
  fileExt: string
  id: string
  name: string
  title: string
  error: boolean
  errorMessage?: string
  existingFileName?: string
  setFieldValue: (field: string, value: File, shouldValidate?: boolean) => void
  onFileChange: (file: File) => void
  setFieldTouched: (
    field: string,
    isTouched: boolean,
    shouldValidate?: boolean
  ) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur: (event: React.FocusEvent<any>) => void
}

const FileSelect = (props: FileSelectProps) => {
  const file = props.value
  const fileName =
    file instanceof File ? file.name : props.existingFileName || ''
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()

      reader.onload = () => {
        props.setFieldValue(props.name, file, true)
        props.setFieldTouched(props.name, true, false)
        // Needed for example to trigger AutoRg calculations when saxs data
        // file is selected for upload.
        if (props.onFileChange) {
          props.onFileChange(file)
        }
      }

      reader.onerror = () => {
        console.error('Error reading file:', reader.error)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleBlur = () => {
    console.log('onBlur triggered')
    props.setFieldTouched(props.name, true)
  }

  return (
    <FormControl margin='normal'>
      <FormLabel sx={{ marginBottom: '0.6em' }}>
        Upload your <b>{props.fileType}</b> file
      </FormLabel>
      <Grid container spacing={2} alignItems='center'>
        <Grid>
          <Input
            style={{ display: 'none' }}
            id={props.id}
            name={props.name}
            type='file'
            onChange={handleFileChange}
            onBlur={handleBlur}
            inputProps={{ accept: props.fileExt }}
          />
          <label htmlFor={props.id}>
            <Button
              variant='contained'
              component='span'
              sx={{ width: '110px' }}
            >
              {props.title}
            </Button>
          </label>
        </Grid>
        <Grid>
          {fileName && !props.errorMessage ? (
            <Alert variant='outlined' severity='success' sx={{ py: 0 }}>
              {fileName}
            </Alert>
          ) : null}
          {props.error ? (
            <Alert severity='error' sx={{ py: 0 }}>
              {props.errorMessage}
            </Alert>
          ) : null}
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default FileSelect
