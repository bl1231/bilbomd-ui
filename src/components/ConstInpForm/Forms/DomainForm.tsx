import { useEffect, useState, useRef, Fragment } from 'react'
import { useFormikContext, FieldArray, FormikValues } from 'formik'
import { Typography, Grid, Button, Chip, Box, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import * as PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import useTitle from 'hooks/useTitle'
import HeaderBox from 'components/HeaderBox'
import RigidBody from '../Helpers/RigidBody'
import { Chain } from 'types/interfaces'

const DomainForm = ({ setStepIsValid }) => {
  useTitle('BilboMD: Define domains')
  const theme = useTheme()
  const { values, isValid } = useFormikContext<FormikValues>()
  const [rigidBodyIndex, setRigidBodyIndex] = useState(1)
  const effectRan = useRef(false)

  // Define background colors for different chain types
  const customColors = {
    PRO: theme.palette.mode === 'light' ? '#E6A8A8' : '#b76e79',
    DNA: theme.palette.mode === 'light' ? '#E9D8A6' : '#b3a272',
    RNA: theme.palette.mode === 'light' ? '#B5E3D8' : '#6daba4',
    CAR: theme.palette.mode === 'light' ? '#A8CCE6' : '#6b95b8',
    Other: theme.palette.mode === 'light' ? '#D1A8E6' : '#9773b9'
  }

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

  const macroMolecules = ['PRO', 'DNA', 'RNA', 'CAR', 'Other']

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HeaderBox>
            <Typography>Instructions</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            <Box>
              <Typography variant='h4' sx={{ m: 1 }}>
                Define your Rigid Bodies & Rigid Domains
              </Typography>
              <Typography sx={{ m: 1 }}>
                This is pretty straight forward. You need to define which ranges
                of residues are to remain rigid during the Molecular Dynamics
                steps of a <b>BilboMD</b> run. Please be aware of the following.
              </Typography>
              <ul>
                <li>
                  <Typography>
                    You need at least one Rigid Body (we&apos;ll call this your{' '}
                    <b>PRIMARY</b> Rigid Body). The Rigid Domains defined as
                    part of your Primary Rigid Body will remain fixed.
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Rigid Domains in subsequently defined Rigid Bodies will be
                    dynamic.
                  </Typography>
                </li>
                <li>
                  <Typography>
                    No overlapping regions either within <b>or</b> between Rigid
                    Bodies are allowed.
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Leave at least <b>one residue</b> between Rigid Domains to
                    allow for efficient conformational sampling.
                  </Typography>
                </li>
              </ul>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <HeaderBox>
            <Typography>Define Rigid Bodies</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            <Grid container>
              <Grid item sx={{ width: '100%' }}>
                <Typography variant='h5' sx={{ py: 1, ml: 1 }}>
                  Macromolecule types:
                </Typography>
                {macroMolecules.map((chain: string, index: number) => (
                  <Chip
                    key={index}
                    label={`${chain}`}
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor: customColors[chain] || '#9773b9',
                      color: theme.palette.getContrastText(customColors[chain])
                    }}
                  />
                ))}
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <Typography variant='h5' sx={{ py: 1, ml: 1 }}>
                  Available Chains (and residue range):
                </Typography>
                {values.pdb_file.chains.map((chain: Chain, index: number) => (
                  <Chip
                    key={index}
                    label={`${chain.id} : ${chain.first_res}-${chain.last_res}`}
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor: customColors[chain.type] || '#9773b9',
                      color: theme.palette.getContrastText(
                        customColors[chain.type]
                      )
                    }}
                  />
                ))}
              </Grid>
              <Grid item sx={{ my: 3 }}>
                <FieldArray name='pdb_file.rigid_bodies'>
                  {(arrayHelpers) => (
                    <>
                      {values.pdb_file.rigid_bodies.length > 0 &&
                        values.pdb_file.rigid_bodies.map(
                          (rigid_body, index) => (
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
                                  <Typography variant='h4'>
                                    Rigid Body: <Chip label={rigid_body.id} />
                                  </Typography>
                                  {values.pdb_file.rigid_bodies[index]?.id ===
                                  'PRIMARY' ? (
                                    <Alert
                                      severity='warning'
                                      sx={{ ml: 2, width: '70%' }}
                                    >
                                      Rigid Domains in the <b>PRIMARY</b> Rigid
                                      Body will remain absolutely fixed during
                                      the Molecular Dynamics steps.
                                    </Alert>
                                  ) : (
                                    <Alert
                                      severity='warning'
                                      sx={{ ml: 2, width: '70%' }}
                                    >
                                      Rigid Domains in <b>{rigid_body.id}</b>{' '}
                                      will move relative to the <b>PRIMARY</b>{' '}
                                      Rigid Body.
                                    </Alert>
                                  )}
                                </Grid>
                                <RigidBody
                                  rigidBodyIndex={index}
                                  // rigidBodiesArrayHelpers={arrayHelpers}
                                />
                                {/* DO NOT SHOW DELETE BUTTON FOR PRIMARY */}
                                {values.pdb_file.rigid_bodies[index]?.id !==
                                'PRIMARY' ? (
                                  <Button
                                    variant='contained'
                                    color='error'
                                    onClick={() => {
                                      decrementRigidBodyIndex()
                                      arrayHelpers.remove(index)
                                    }}
                                    size='small'
                                  >
                                    {/* Delete {values.pdb_file.rigid_bodies[index]?.id} */}
                                    Delete Rigid Body
                                  </Button>
                                ) : (
                                  ''
                                )}
                              </Grid>
                            </Fragment>
                          )
                        )}
                      <Grid
                        item
                        xs={12}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Button
                          variant='contained'
                          onClick={() => {
                            incrementRigidBodyIndex()
                            const new_rigid_body = {
                              id: 'RIGID ' + rigidBodyIndex,
                              domains: [
                                {
                                  chainid: values.pdb_file.chains[0].id,
                                  start: values.pdb_file.chains[0].first_res,
                                  end: values.pdb_file.chains[0].last_res
                                }
                              ]
                            }
                            arrayHelpers.push(new_rigid_body)
                          }}
                          startIcon={<AddIcon />}
                          size='large'
                          sx={{}}
                        >
                          Add Rigid Body
                        </Button>
                      </Grid>
                    </>
                  )}
                </FieldArray>
              </Grid>
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
