import React, { useState } from 'react'
import { useField, Field, useFormikContext, FieldArray, ErrorMessage } from 'formik'
import { Grid, TextField, Typography, Button, Chip, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/system'
import Domain from './Domain'

const RigidBody = ({ rigidBodyIndex, rigidBodiesArrayHelpers }) => {
  const [field, meta, helper] = useField('crd_file')
  const { touched, error } = meta
  const { setValue, setError } = helper
  const isError = Boolean(touched && error)
  const { value } = field
  const [id, setId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  // const { nextDomainIndex, setNextDomainIndex } = useState(rigidBodyIndex + 1)
  const { values, handleChange, handleBlur, errors } = useFormikContext()

  // const handleAddNewRigidDomain = () => {
  //   const domain = {
  //     chainid: '',
  //     start: '',
  //     end: ''
  //   }
  //   rigidBodiesArrayHelpers.push(domain)
  // }

  return (
    <React.Fragment>
      <Grid
        container
        // direction="row"
        // blue-2
        sx={{ my: 1, backgroundColor: '#bae0ff', borderRadius: 2 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <React.Fragment>
            {/* <Typography
              variant="h5"
              sx={{
                display: 'flex',
                flex: '0 1 auto',
                alignItems: 'center',
                m: 2
              }}
            >
              Rigid Body Index {rigidBodyIndex + 1}:
            </Typography> */}

            <FieldArray name={`crd_file.rigid_bodies[${rigidBodyIndex}].domains`}>
              {({ arrayHelpers, insert, remove, push }) => (
                <React.Fragment>
                  {values.crd_file.rigid_bodies[rigidBodyIndex].domains.map(
                    (domain, index) => (
                      <React.Fragment key={index}>
                        <Grid
                          item
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            px: 1,
                            m: 1,
                            backgroundColor: '#e6f4ff', //blue-1
                            borderRadius: 1,
                            alignItems: 'center',
                            flex: '1 1 100%',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Domain
                            rigidBodyIndex={rigidBodyIndex}
                            domain={domain}
                            domainIndex={index}
                            domainArrayHelpers={arrayHelpers}
                          />

                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => remove(index)}
                            // sx={{ alignItems: 'flex-end' }}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </React.Fragment>
                    )
                  )}
                  <Grid item sx={{ flex: '1 1 auto', alignItems: 'center' }}>
                    <Box sx={{ justifyContent: 'flex-end', m: 1 }}>
                      <Grid container justifyContent="flex-end">
                        <Button
                          variant="contained"
                          // onClick={handleAddNewRigidDomain}
                          onClick={() => {
                            console.log('Add Rigid Domain')

                            const new_domain = {
                              chainid: '',
                              start: '',
                              end: ''
                            }
                            push(new_domain)
                          }}
                          startIcon={<AddIcon />}
                        >
                          Add Rigid Domain
                        </Button>
                      </Grid>
                    </Box>
                  </Grid>
                </React.Fragment>
              )}
            </FieldArray>
          </React.Fragment>
        </Box>
      </Grid>
    </React.Fragment>
  )
}

export default RigidBody
