import React from 'react'
import { Field } from 'formik'

const UploadField = ({
  field,
  form: { touched, errors },
  name,
  label,
  isError,
  ...props
}) => {
  return (
    <>
      <Field
        variant="outlined"
        name="uploader"
        title={label}
        type="file"
        style={{
          display: 'flex',
          color: isError ? 'red' : 'var(--main-color)'
        }}
        {...props}
      />
      {/* {isError && <FormHelperText>{errors[field.name]}</FormHelperText>} */}
    </>
  )
}

export { UploadField }
