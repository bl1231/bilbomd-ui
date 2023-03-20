import React from 'react'
import { Field } from 'formik'
import { FormHelperText } from '@mui/material'

const UploadField = ({
  field,
  form: { touched, errors },
  name,
  label,
  isError,
  ...props
}) => {
  return (
    <React.Fragment>
      <Field variant="outlined" name="uploaderrr" title={label} type="file" {...props} />
      {isError && <FormHelperText>{errors[field.name]}</FormHelperText>}
    </React.Fragment>
  )
}

export { UploadField }
