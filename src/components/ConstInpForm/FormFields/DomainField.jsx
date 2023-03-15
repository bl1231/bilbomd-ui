import React from 'react'
import { Field } from 'formik'

const DomainField = ({
  field,
  form: { touched, errors },
  name,
  label,
  isError,
  ...props
}) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export { DomainField }
