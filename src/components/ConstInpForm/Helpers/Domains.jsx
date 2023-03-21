import React, { useState } from 'react'
import { useField, Field, useFormikContext, ErrorMessage } from 'formik'
import { Grid, TextField, Typography, Button, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/system'

const Domains = ({ chainIndex, domainsArrayHelpers }) => {
  const [field, meta, helper] = useField('crd_file')
  const { touched, error } = meta
  const { setValue, setError } = helper
  const isError = Boolean(touched && error)
  const { value } = field
  // const [id, setId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  // const { nextDomainIndex, setNextDomainIndex } = useState(chainIndex + 1)
  const { values, handleChange, handleBlur, isValid, errors } = useFormikContext()

  const handleUpdateRigidDomain = () => {
    const domain = {}
    // domain.id = id
    domain.start = start
    domain.end = end
    domainsArrayHelpers.push(domain)
    // setId('')
    // setStart('')
    // setEnd('')
  }

  const handleAddNewRigidDomain = () => {
    const domain = {
      start: '',
      end: ''
    }
    domainsArrayHelpers.push(domain)
  }

  // const handleChangeId = (event) => {
  //   setId(event.currentTarget.value)
  // }
  const handleChangeStart = (event) => {
    setStart(event.currentTarget.value)
  }
  const handleChangeEnd = (event) => {
    setEnd(event.currentTarget.value)
  }

  return (
    <React.Fragment>
      <Grid container direction="column" sx={{ my: 1, backgroundColor: '#f4ffb8' }}>
        <Grid item sx={{ flex: '1 1 auto', alignItems: 'center' }}>
          {values.crd_file.chains[chainIndex].domains.map((domain, index) => (
            <React.Fragment>
              {/* <pre>{JSON.stringify(domain, null, 2)}</pre> */}
              <Grid
                item
                // key={domain.id + index}
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  p: 1,
                  backgroundColor: '#eaff8f'
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
                      domain {index + 1}:
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
                    // name="start"
                    name={`crd_file.chains[${chainIndex}].domains[${index}].start`}
                    type="text"
                    as={TextField}
                    // helperText="starting residue"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(
                      errors.crd_file?.chains[chainIndex]?.domains[index]?.start
                    )}
                    helperText={
                      errors.crd_file?.chains[chainIndex]?.domains[index]?.start
                        ? errors.crd_file?.chains[chainIndex]?.domains[index]?.start
                        : ''
                    }
                    sx={{ mx: 4 }}
                  />

                  <Field
                    label="End"
                    id="end"
                    // name="end"
                    name={`crd_file.chains[${chainIndex}].domains[${index}].end`}
                    type="text"
                    as={TextField}
                    // helperText="ending residue"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(
                      errors.crd_file?.chains[chainIndex]?.domains[index]?.end
                    )}
                    helperText={
                      errors.crd_file?.chains[chainIndex]?.domains[index]?.end
                        ? errors.crd_file?.chains[chainIndex]?.domains[index]?.end
                        : ''
                    }
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
                  {/* <Button
                    type="button"
                    variant="contained"
                    size="regular"
                    onClick={() => {
                      console.log('update domain')
                      // handleUpdateRigidDomain()
                    }}
                    // disabled={!isValid}
                  >
                    Update
                  </Button> */}
                </Grid>
              </Grid>

              <Grid item sx={{ flex: '0 1 auto' }}>
                <ErrorMessage
                  name={`crd_file.chains[${chainIndex}].domains[${index}].start`}
                />
                <ErrorMessage
                  name={`crd_file.chains[${chainIndex}].domains[${index}].end`}
                />
              </Grid>
            </React.Fragment>
          ))}

          <Box sx={{ justifyContent: 'flex-end' }}>
            <Grid container justifyContent="flex-end">
              <Button variant="contained" onClick={handleAddNewRigidDomain}>
                <AddIcon />
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Domains
