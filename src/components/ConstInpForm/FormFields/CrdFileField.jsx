import { Button, FormControl, FormHelperText, FormLabel, Input } from '@mui/material'
import React from 'react'

const CrdFileField = (props) => {
  return (
    <FormControl>
      {/* <FormLabel>Upload CRD file</FormLabel> */}
      <Input
        style={{ display: 'none' }}
        id={props.id}
        name={props.name}
        type="file"
        // accept={props.fileExt}
        onChange={props.onChange}
        // onBlur={(e) => {
        //   console.log('onBlur triggered', e)
        // }}
        // {...props}
      />
      <label htmlFor={props.id}>
        <Button variant="contained" component="span" sx={{ mr: 2 }}>
          {props.title}
        </Button>
      </label>

      {props.isError ? (
        <FormHelperText sx={{ ml: 0, color: '#cf1322', fontSize: 16 }}>
          <React.Fragment>
            {/* {JSON.stringify(props.error, null, 2)} */}
            Error: {props.error.file}
          </React.Fragment>
        </FormHelperText>
      ) : null}
    </FormControl>
  )
}

export default CrdFileField
