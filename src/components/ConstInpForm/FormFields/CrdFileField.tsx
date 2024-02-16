// CrdFileField.tsx
import { Button, FormControl, Input, FormHelperText } from '@mui/material'
import * as PropTypes from 'prop-types'

const CrdFileField = ({ id, name, onChange, title, isError, errorMessage }) => {
  return (
    <FormControl error={isError}>
      <Input
        style={{ display: 'none' }}
        id={id}
        name={name}
        type="file"
        onChange={onChange}
      />
      <label htmlFor={id}>
        <Button variant="contained" component="span" sx={{ mr: 2 }}>
          {title}
        </Button>
      </label>
      {isError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  )
}

CrdFileField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string
}

export default CrdFileField
