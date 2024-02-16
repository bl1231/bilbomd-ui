import { Fragment } from 'react'
import { useFormikContext, FieldArray, FormikValues } from 'formik'
import { Grid, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/system'
import Domain from './Domain'
import * as PropTypes from 'prop-types'

const RigidBody = ({ rigidBodyIndex }) => {
  const { values } = useFormikContext<FormikValues>()

  return (
    <>
      <Grid container sx={{ my: 1, backgroundColor: '#bae0ff', borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <>
            <FieldArray name={`pdb_file.rigid_bodies[${rigidBodyIndex}].domains`}>
              {(arrayHelpers) => (
                <>
                  {values.pdb_file.rigid_bodies[rigidBodyIndex].domains.map(
                    (domain, index) => (
                      <Fragment key={index}>
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
                          />

                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => arrayHelpers.remove(index)}
                            // sx={{ alignItems: 'flex-end' }}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Fragment>
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
                            arrayHelpers.push(new_domain)
                          }}
                          startIcon={<AddIcon />}
                        >
                          Add Rigid Domain
                        </Button>
                      </Grid>
                    </Box>
                  </Grid>
                </>
              )}
            </FieldArray>
          </>
        </Box>
      </Grid>
    </>
  )
}

RigidBody.propTypes = {
  rigidBodyIndex: PropTypes.number.isRequired
}

export default RigidBody
