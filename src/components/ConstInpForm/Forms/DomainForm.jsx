import React, { useEffect, useState, useRef } from 'react'
import { useFormikContext, useField, FieldArray, Field } from 'formik'
import { Typography, Grid, TextField, Button } from '@mui/material'
import { Box } from '@mui/system'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import useTitle from 'hooks/useTitle'
// import DomainCard from '../Helpers/DomainCard'
// import Domains from '../Helpers/Domains'
import RigidBody from '../Helpers/RigidBody'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px'
}

const handleAddNewRigidBody = (name) => {
  console.log('here')
  const new_rigid_body = {
    id: name,
    domains: [
      {
        chainid: '',
        start: '',
        end: ''
      }
    ]
  }
  console.log('add new rigid body named', name)
  // values.crd_file.rigid_bodies.push(new_rigid_body)
  //console.log(values.crd_file.rigid_bodies)
  //rigidBodiesArrayHelpers.push(new_rigid_body)
}

const DomainForm = ({ setStepIsValid }) => {
  useTitle('BilboMD: define domains')
  const { values, handleChange, handleBlur, errors, isValid } = useFormikContext()
  const [field, meta, helper] = useField('crd_file')
  const { value } = field
  const { touched, error } = meta
  const { setValue, setTouched } = helper
  const isError = touched && error

  const [fileName, setFileName] = useState(value.name)
  const [file, setFile] = useState(value.file)
  const [src, setSrc] = useState(value.src)
  const [chains, setChains] = useState(value.chains)
  const [rigidBodies, setRigidBodies] = useState(value.rigid_bodies)

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // not exactly sure of best place for this.
      // Need to update parent of isValid so we can enable/disable the "NEXT" button
      // console.log('valid:', isValid)
      setStepIsValid(isValid)
      // console.log(JSON.stringify(values, null, 2))
    }
    return () => {
      effectRan.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid])

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Instructions</Typography>
          <Item>
            <Typography variant="h4" sx={{ m: 1 }}>
              Define your Rigid Bodies
            </Typography>
            <Typography sx={{ m: 1 }}>
              This is pretty straight forward. You need to define which ranges of residues
              are to remain rigid during the Molecular Dynamics steps of a <b>BilboMD</b>{' '}
              run. Please be aware of the following.
              <li>
                You need at least one Rigid Body (we'll call this your Primary RB). The
                Rigid Domains defined inside your Primary RB will remain absolutley fixed.
              </li>
              <li>
                No overlapping regions either within <b>or</b> between Rigid Bodies.
              </li>
              <li>
                You must leave at least <b>one residue</b> between Rigid Domains to allow
                for efficient conformational sampling.
              </li>
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Define Rigid Bodies</Typography>
          <Item>
            {/* <Typography variant="h5" sx={{ mx: 1, my: 2 }}>
              {values.crd_file.name} has {values.crd_file.chains.length} Chains
            </Typography> */}

            <Grid item sx={{ my: 3 }}>
              <FieldArray name="crd_file.rigid_bodies">
                {({ arrayHelpers, insert, remove, push }) => (
                  <React.Fragment>
                    {values.crd_file.rigid_bodies.length > 0 &&
                      values.crd_file.rigid_bodies.map((rigid_body, index) => (
                        <React.Fragment key={index}>
                          <Grid item sx={{ mb: 4, py: 1 }}>
                            <Grid
                              item
                              sx={{
                                display: 'flex',
                                flexDirection: 'row'
                                // flex: '0 3 auto',
                                // justifyContent: 'space-between',
                                // p: 2,
                                // m: 1,

                                // borderRadius: 1
                              }}
                            >
                              <Field
                                label="Rigid Body Name"
                                name={`crd_file.rigid_bodies[${index}].id`}
                                id="id"
                                type="text"
                                as={TextField}
                                // InputProps={{
                                //   readOnly: true
                                // }}
                                disabled={
                                  values.crd_file.rigid_bodies[index].id === 'PRIMARY'
                                    ? true
                                    : false
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.title && touched.title}
                                helperText={
                                  errors.title && touched.title ? errors.title : ''
                                }
                              />
                              <Typography variant="h5" sx={{ ml: 1, mb: 1 }}>
                                {rigid_body.id}
                              </Typography>
                            </Grid>
                            <RigidBody
                              rigidBodyIndex={index}
                              rigidBodiesArrayHelpers={arrayHelpers}
                            />
                            {/* DO NOT SHOW DELETE BUTTON FOR PRIMARY */}
                            {values.crd_file.rigid_bodies[index].id !== 'PRIMARY' ? (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => remove(index)}
                              >
                                {' '}
                                Delete Rigid Body {values.crd_file.rigid_bodies[index].id}
                              </Button>
                            ) : (
                              ''
                            )}
                          </Grid>
                        </React.Fragment>
                      ))}
                    <Button
                      variant="contained"
                      onClick={() => {
                        const new_rigid_body = {
                          id: 'NEW',
                          domains: [
                            {
                              chainid: '',
                              start: '',
                              end: ''
                            }
                          ]
                        }
                        push(new_rigid_body)
                      }}
                      startIcon={<AddIcon />}
                    >
                      Add Rigid Body
                    </Button>
                  </React.Fragment>
                )}
              </FieldArray>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default DomainForm
