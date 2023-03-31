import React, { useState } from 'react'
import { useField, Field, useFormikContext, ErrorMessage } from 'formik'
import { Grid, TextField, Typography, Button, Chip, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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
  // const { nextDomainIndex, setNextDomainIndex } = useState(chainIndex + 1)
  const { values, handleChange, handleBlur, errors } = useFormikContext()

  const handleAddNewRigidDomain = () => {
    const domain = {
      start: '',
      end: ''
    }
    domainsArrayHelpers.push(domain)
  }

  return (
    <React.Fragment>
      {/* This is the Chain container */}
      <Grid
        container
        direction="column"
        sx={{ my: 1, backgroundColor: '#52c41a', borderRadius: 1 }}
      >
        <Grid item sx={{ flex: '1 1 auto', alignItems: 'center' }}>
          {values.crd_file.chains[chainIndex].domains.map((domain, index) => (
            <React.Fragment key={index}>
              <Grid
                item
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  p: 1,
                  m: 1,
                  backgroundColor: '#eaff8f',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
                      Domain {index + 1}:
                    </Typography>
                    <Chip
                      label={`${domain.start} - ${domain.end}`}
                      variant="outlined"
                      sx={{ backgroundColor: '#a0d911' }}
                    />
                  </React.Fragment>
                </Box>

                <Box sx={{ flex: '1 1 auto' }} />

                <Grid item sx={{ flex: '0 1 auto', alignItems: 'center' }}>
                  <Field
                    label="Start"
                    id="start"
                    name={`crd_file.chains[${chainIndex}].domains[${index}].start`}
                    type="text"
                    as={TextField}
                    helperText="starting residue"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(
                      errors.crd_file?.chains[chainIndex]?.domains[index]?.start
                    )}
                    sx={{ mx: 4 }}
                  />

                  <Field
                    label="End"
                    id="end"
                    name={`crd_file.chains[${chainIndex}].domains[${index}].end`}
                    type="text"
                    as={TextField}
                    helperText="ending residue"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(
                      errors.crd_file?.chains[chainIndex]?.domains[index]?.end
                    )}
                    sx={{ mx: 4 }}
                  />
                  {value.chains[chainIndex].domains[index] ? (
                    <Button
                      type="button"
                      variant="contained"
                      size="regular"
                      color="error"
                      onClick={() => domainsArrayHelpers.remove(index)}
                      sx={{ marginTop: '0.1em', ml: 2 }}
                    >
                      Delete
                    </Button>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>

              <Grid item sx={{ flex: '0 1 auto' }}>
                {errors.crd_file?.chains[chainIndex]?.domains[index]?.start ? (
                  <ErrorMessage
                    component={Alert}
                    severity="error"
                    name={`crd_file.chains[${chainIndex}].domains[${index}].start`}
                  ></ErrorMessage>
                ) : (
                  ''
                )}
                {errors.crd_file?.chains[chainIndex]?.domains[index]?.end ? (
                  <ErrorMessage
                    component={Alert}
                    severity="error"
                    name={`crd_file.chains[${chainIndex}].domains[${index}].end`}
                  ></ErrorMessage>
                ) : (
                  ''
                )}
              </Grid>
            </React.Fragment>
          ))}

          <Box sx={{ justifyContent: 'flex-end', m: 1 }}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleAddNewRigidDomain}
                startIcon={<AddIcon />}
              >
                Add Domain
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Domains
