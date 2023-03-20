import React, { useState } from 'react'
import { useField, Field, useFormikContext } from 'formik'
import { Grid, TextField, Typography, Button, Chip } from '@mui/material'
import { Box } from '@mui/system'

const Domains = ({ chainIndex, domainsArrayHelpers }) => {
  const [field, meta, helper] = useField('crd_file')
  const { touched, error } = meta
  const { setValue, setError } = helper
  const isError = Boolean(touched && error)
  const { value } = field
  const [id, setId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const { values } = useFormikContext()

  const handleAddRigidDomain = () => {
    const domain = {}
    domain.id = id
    domain.start = start
    domain.end = end
    domainsArrayHelpers.push(domain)
    setId('')
    setStart('')
    setEnd('')
  }

  const handleChangeId = (event) => {
    setId(event.currentTarget.value)
  }
  const handleChangeStart = (event) => {
    setStart(event.currentTarget.value)
  }
  const handleChangeEnd = (event) => {
    setEnd(event.currentTarget.value)
  }

  return (
    <Grid container direction="column" sx={{ my: 1, backgroundColor: '#f4ffb8' }}>
      <Grid item sx={{ flex: '0 1 auto' }}>
        {values.crd_file.chains[chainIndex].domains.map((domain, index) => (
          <Grid
            item
            key={domain.id + index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              p: 1,
              backgroundColor: '#eaff8f'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <React.Fragment>
                <Typography
                  variant="h5"
                  sx={{
                    display: 'flex',
                    flex: '0 1 auto',
                    alignItems: 'center',
                    mr: 2
                  }}
                >
                  domain {index + 1}:
                </Typography>
                <Chip label={`${domain.start} - ${domain.end}`} />
              </React.Fragment>
            </Box>

            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              type="button"
              variant="contained"
              size="small"
              color="error"
              onClick={() => domainsArrayHelpers.remove(index)}
            >
              Delete
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid item sx={{ flex: '0 1 auto' }}>
        <Field
          label="Start"
          id="start"
          name="start"
          type="text"
          // disabled={isSubmitting}
          as={TextField}
          // error={isError}
          helperText="starting residue"
          onChange={handleChangeStart}
          // onBlur={handleBlur}
        />
        {/* <input type="text" value={end} onChange={handleChangeEnd} /> */}
        <Field
          label="End"
          id="end"
          name="end"
          type="text"
          as={TextField}
          helperText="ending residue"
          onChange={handleChangeEnd}
        />
        <Button
          type="button"
          variant="contained"
          onClick={handleAddRigidDomain}
          // disabled={!isValid}
        >
          add rigid domain to {values.crd_file.chains[chainIndex].id}
        </Button>
      </Grid>
      <Grid item>
        <React.Fragment>
          {isError ? JSON.stringify(error.chains[chainIndex], null, 2) : null}
          {/* {isError ? error.chains[chainIndex] : 'no error'} */}
        </React.Fragment>
      </Grid>
    </Grid>
  )
}

export default Domains
