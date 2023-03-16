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
        name="temporary"
        title={label}
        type="file"
        sx={{ display: 'flex' }}
        {...props}
      />
    </React.Fragment>
  )
}

export { DomainField }
