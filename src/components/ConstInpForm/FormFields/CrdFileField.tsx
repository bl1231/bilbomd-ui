import { Button, FormControl, Input } from '@mui/material'
import * as PropTypes from 'prop-types'

const CrdFileField = ({ id, name, onChange, title }) => {
  return (
    <FormControl>
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
    </FormControl>
  )
}

CrdFileField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default CrdFileField
