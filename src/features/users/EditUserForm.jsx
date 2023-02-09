import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormGroup,
  useRadioGroup,
  Select,
  InputLabel,
  OutlinedInput,
  ListItemText
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { Debug } from 'components/Debug'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { ROLES } from 'config/roles'
import { useNavigate } from 'react-router-dom'
import { editUserSchema } from 'schemas/ValidationSchemas'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 50
    }
  }
}

const EditUserForm2 = ({ user }) => {
  const initialValues = {
    username: user.username,
    email: user.email,
    active: true,
    roles: user.roles
  }

  // prettier-ignore
  const [updateUser, {
    isLoading,
    isSuccess,
    isError,
    error,
  }] = useUpdateUserMutation();

  // prettier-ignore
  const [deleteUser, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror,
  }] = useDeleteUserMutation();

  const navigate = useNavigate()

  useEffect(() => {
    console.log(isSuccess)
    if (isSuccess || isDelSuccess) {
      // setUsername('')
      // setPassword('')
      // setRoles([])
      navigate('/dashboard/users')
    }
  }, [isSuccess, isDelSuccess, navigate])

  // const onSaveUserClicked = async (e) => {
  //   await updateUser({ id: user.id, userbane: values.username, values.roles, valies.isActive })
  // }

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id })
  }

  const onSubmit = async (values, { isLoading, isSuccess, isError, error }) => {
    console.log('clicked')
    await updateUser({
      id: user.id,
      username: values.username,
      roles: values.roles,
      active: values.active
    })
  }

  const content = (
    <Card>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={editUserSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
            handleChange,
            setFieldValue,
            handleBlur,
            resetForm
          }) => (
            <Form>
              <Grid
                container
                direction="column"
              >
                <Grid
                  item
                  sx={{ my: 2, width: '300px' }}
                >
                  <Field
                    name="username"
                    id="username"
                    label="Username"
                    type="text"
                    autoComplete="off"
                    disabled={isSubmitting}
                    component={TextField}
                    onChange={handleChange}
                    value={values.username || ''}
                  />
                </Grid>
                <Grid
                  item
                  sx={{ my: 2, width: '300px' }}
                >
                  <Field
                    name="email"
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="off"
                    fullWidth
                    disabled={isSubmitting}
                    component={TextField}
                    onChange={handleChange}
                    value={values.email || ''}
                  />
                </Grid>

                <Grid
                  item
                  sx={{ my: 2 }}
                >
                  <FormLabel component="legend">Make User active or inactive</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={values.active} />}
                      label="Active"
                      name="active"
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Grid>
                <Grid
                  item
                  sx={{ mb: 2 }}
                >
                  {/* https://github.com/jaredpalmer/formik/issues/2123 */}

                  <FormLabel component="legend">Assign Roles</FormLabel>
                  <FormControl sx={{ my: 2, width: 300 }}>
                    <InputLabel id="roles">Roles</InputLabel>
                    <Select
                      labelId="roles"
                      id="roles"
                      multiple={true}
                      value={values.roles}
                      onChange={handleChange('roles')}
                      input={<OutlinedInput label="Roles" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {Object.values(ROLES).map((role) => (
                        <MenuItem
                          key={role}
                          value={role}
                        >
                          <Checkbox checked={values.roles.indexOf(role) > -1} />
                          <ListItemText primary={role} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    sx={{ mr: 2 }}
                    onClick={onDeleteUserClicked}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{ mr: 2 }}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
              <Debug />
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
  return content
}

export default EditUserForm2
