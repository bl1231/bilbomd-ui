import { useEffect, useState, useRef, Fragment } from 'react'
import { useFormikContext, FieldArray, FormikValues } from 'formik'
import { Typography, Grid, Button, Chip } from '@mui/material'
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
    Protein: theme.palette.mode === 'light' ? '#E6A8A8' : '#b76e79',
    DNA: theme.palette.mode === 'light' ? '#E9D8A6' : '#b3a272',
    RNA: theme.palette.mode === 'light' ? '#B5E3D8' : '#6daba4',
    Carbohydrate: theme.palette.mode === 'light' ? '#A8CCE6' : '#6b95b8',
    Other: theme.palette.mode === 'light' ? '#D1A8E6' : '#9773b9'
  }

  // Select the background color based on the chain type
  // const chipBackgroundColor =
  //   customColors[values.pdb_file.chains.type] || theme.palette.grey[400]
  // Dynamically calculate the contrasting text color for accessibility
  // const chipHeaderColor = theme.palette.getContrastText(chipBackgroundColor)

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
  const macroMolecules = ['Protein', 'DNA', 'RNA', 'Carbohydrate', 'Other']
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
                You need at least one Rigid Body (we&apos;ll call this your <b>PRIMARY</b>{' '}
                Rigid Body). The Rigid Domains defined inside your Primary RB will remain
                absolutley fixed.
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
            <Grid item>
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
            <Typography variant="h4" sx={{ py: 1, ml: 1 }}>
              Available Chains:{' '}
            </Typography>
            {values.pdb_file.chains.map((chain: Chain, index: number) => (
              <Chip
                key={index}
                label={`${chain.id} : ${chain.first_res}-${chain.last_res}`}
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: customColors[chain.type] || '#9773b9',
                  color: theme.palette.getContrastText(customColors[chain.type])
                }}
              />
            ))}

            <Grid item sx={{ my: 3 }}>
              <FieldArray name="pdb_file.rigid_bodies">
                {(arrayHelpers) => (
                  <>
                    {values.pdb_file.rigid_bodies.length > 0 &&
                      values.pdb_file.rigid_bodies.map((rigid_body, index) => (
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
                              {values.pdb_file.rigid_bodies[index]?.id === 'PRIMARY' ? (
                                <Typography sx={{ ml: 3 }}>
                                  <b>note:</b> Residues in the <b>PRIMARY</b> Rigid Body
                                  will remain absolutely fixed during the Molecular
                                  Dynamics steps.
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
                            {values.pdb_file.rigid_bodies[index]?.id !== 'PRIMARY' ? (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  decrementRigidBodyIndex()
                                  arrayHelpers.remove(index)
                                }}
                              >
                                {/* Delete {values.pdb_file.rigid_bodies[index]?.id} */}
                                Delete Rigid Body
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
                              chainid: values.pdb_file.chains[0].id,
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
