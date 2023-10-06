import { useEffect, useState, useRef, Fragment } from 'react'
import { useFormikContext, FieldArray, FormikValues } from 'formik'
import { Typography, Grid, Button, Chip } from '@mui/material'
import * as PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import useTitle from 'hooks/useTitle'
import HeaderBox from 'components/HeaderBox'
import RigidBody from '../Helpers/RigidBody'

const DomainForm = ({ setStepIsValid }) => {
  useTitle('BilboMD: Define domains')
  const { values, isValid } = useFormikContext<FormikValues>()
  const [rigidBodyIndex, setRigidBodyIndex] = useState(1)
  const effectRan = useRef(false)

  const incrementRigidBodyIndex = () => {
    setRigidBodyIndex(rigidBodyIndex + 1)
  }
  const decrementRigidBodyIndex = () => {
    setRigidBodyIndex(rigidBodyIndex - 1)
  }

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      setStepIsValid(isValid)
    }
    return () => {
      effectRan.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HeaderBox>
            <Typography>Instructions</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            <Typography variant="h4" sx={{ m: 1 }}>
              Define your Rigid Bodies
            </Typography>
            <Typography sx={{ m: 1 }}>
              This is pretty straight forward. You need to define which ranges of residues
              are to remain rigid during the Molecular Dynamics steps of a <b>BilboMD</b>{' '}
              run. Please be aware of the following.
              <li>
                You need at least one Rigid Body (we&apos;ll call this your Primary RB).
                The Rigid Domains defined inside your Primary RB will remain absolutley
                fixed.
              </li>
              <li>
                No overlapping regions either within <b>or</b> between Rigid Bodies.
              </li>
              <li>
                Leave at least <b>one residue</b> between Rigid Domains to allow for
                efficient conformational sampling.
              </li>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <HeaderBox>
            <Typography>Define Rigid Bodies</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            <Typography>Available Chains: </Typography>
            {values.crd_file.chains.map((chain, index) => (
              <Chip
                key={index}
                label={`${chain.id} : ${chain.first_res}-${chain.last_res}`}
                variant="outlined"
                sx={{ backgroundColor: '#d9d9d9', m: 2 }}
              />
            ))}

            <Grid item sx={{ my: 3 }}>
              <FieldArray name="crd_file.rigid_bodies">
                {(arrayHelpers) => (
                  <>
                    {values.crd_file.rigid_bodies.length > 0 &&
                      values.crd_file.rigid_bodies.map((rigid_body, index) => (
                        <Fragment key={index}>
                          <Grid item sx={{ mb: 4, py: 1 }}>
                            <Grid
                              item
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                ml: 1,
                                mb: 1,
                                alignContent: 'baseline'
                              }}
                            >
                              <Typography variant="h4">
                                Rigid Body: <Chip label={rigid_body.id} />
                              </Typography>
                              {values.crd_file.rigid_bodies[index]?.id === 'PRIMARY' ? (
                                <Typography sx={{ ml: 3 }}>
                                  <b>note:</b> Residues in <b>PRIMARY</b> will remain
                                  absolutely fixed during the Molecular Dynamics steps.
                                </Typography>
                              ) : (
                                <Typography sx={{ ml: 1 }}>
                                  <b>note:</b> Residues in this Rigid Body will move
                                  relative to the <b>PRIMARY</b> Rigid Body.
                                </Typography>
                              )}
                            </Grid>
                            <RigidBody
                              rigidBodyIndex={index}
                              // rigidBodiesArrayHelpers={arrayHelpers}
                            />
                            {/* DO NOT SHOW DELETE BUTTON FOR PRIMARY */}
                            {values.crd_file.rigid_bodies[index]?.id !== 'PRIMARY' ? (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  decrementRigidBodyIndex()
                                  arrayHelpers.remove(index)
                                }}
                              >
                                Delete {values.crd_file.rigid_bodies[index]?.id}
                              </Button>
                            ) : (
                              ''
                            )}
                          </Grid>
                        </Fragment>
                      ))}
                    <Button
                      variant="contained"
                      onClick={() => {
                        incrementRigidBodyIndex()
                        const new_rigid_body = {
                          id: 'RIGID ' + rigidBodyIndex,
                          domains: [
                            {
                              chainid: values.crd_file.chains[0].id,
                              start: '',
                              end: ''
                            }
                          ]
                        }
                        arrayHelpers.push(new_rigid_body)
                      }}
                      startIcon={<AddIcon />}
                    >
                      Add Rigid Body
                    </Button>
                  </>
                )}
              </FieldArray>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

DomainForm.propTypes = {
  setStepIsValid: PropTypes.func.isRequired
}

export default DomainForm
