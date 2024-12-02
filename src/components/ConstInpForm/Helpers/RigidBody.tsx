import { Fragment } from 'react'
import { useFormikContext, FieldArray, FieldArrayRenderProps } from 'formik'
import { Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/system'
import { lightBlue } from '@mui/material/colors'
import Domain from './Domain'
import type { Chain, RigidBody, RigidDomain } from 'types/interfaces'

// Define form values interface
interface FormValues {
  pdb_file: {
    rigid_bodies: RigidBody[] // Array of rigid bodies
    chains: Chain[] // Array of chains
  }
}

const RigidBody = ({ rigidBodyIndex }: { rigidBodyIndex: number }) => {
  const { values } = useFormikContext<FormValues>()

  return (
    <>
      <Grid
        container
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
          <>
            <FieldArray
              name={`pdb_file.rigid_bodies[${rigidBodyIndex}].domains`}
            >
              {(arrayHelpers: FieldArrayRenderProps) => (
                <>
                  {values.pdb_file.rigid_bodies[rigidBodyIndex].domains.map(
                    (domain: RigidDomain, index: number) => (
                      <Fragment key={index}>
                        <Grid
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
                            variant='contained'
                            color='error'
                            size='small'
                            onClick={() => arrayHelpers.remove(index)}
                            // sx={{ alignItems: 'flex-end' }}
                          >
                            Delete Segment
                          </Button>
                        </Grid>
                      </Fragment>
                    )
                  )}
                  <Grid sx={{ flex: '1 1 auto', alignItems: 'center' }}>
                    <Box sx={{ justifyContent: 'flex-end', m: 1 }}>
                      <Grid container justifyContent='flex-end'>
                        <Grid sx={{ mx: 2 }}>
                          <Typography>
                            If you want to add another <b>Rigid Body</b> please
                            use the big blue button below.
                          </Typography>
                        </Grid>
                        <Grid>
                          <Button
                            variant='contained'
                            onClick={() => {
                              const new_domain = {
                                chainid: values.pdb_file.chains[0].id,
                                start: values.pdb_file.chains[0].first_res,
                                end: values.pdb_file.chains[0].last_res
                              }
                              arrayHelpers.push(new_domain)
                            }}
                            startIcon={<AddIcon />}
                            size='small'
                            sx={{
                              backgroundColor: lightBlue[50],
                              color: 'black',
                              '&:hover': {
                                backgroundColor: lightBlue[200]
                              }
                            }}
                          >
                            Add New Rigid Segment
                          </Button>
                        </Grid>
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

// RigidBody.propTypes = {
//   rigidBodyIndex: PropTypes.number.isRequired
// }

export default RigidBody
