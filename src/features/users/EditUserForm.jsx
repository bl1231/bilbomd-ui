import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  TextField,
  MenuItem,
  Alert,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormGroup,
  Select,
  InputLabel,
  OutlinedInput,
  ListItemText
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
// import DialogTitle from '@mui/material/DialogTitle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
// import { Debug } from 'components/Debug'
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

const EditUserForm = ({ user }) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    // console.log('cancel')
  }

  const handleDeleteUser = async () => {
    setOpen(false)
    // console.log('delete')
    await deleteUser({ id: user.id })
  }

  const initialValues = {
    username: user.username,
    email: user.email,
    active: user.active,
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

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

  useEffect(() => {
    // console.log(isSuccess)
    if (isSuccess || isDelSuccess) {
      // setUsername('')
      // setPassword('')
      // setRoles([])
      navigate('../users')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const myOnSubmit = async (values, { isLoading, isSuccess, isError, error }) => {
    // console.log('clicked')
    await updateUser({
      id: user.id,
      username: values.username,
      roles: values.roles,
      active: values.active,
      email: values.email
    })
  }

  const content = (
    <Card>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={editUserSchema}
          onSubmit={myOnSubmit}
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
              <Grid container direction="column">
                <Grid item sx={{ my: 2, width: '300px' }}>
                  <Field
                    name="username"
                    id="username"
                    label="Username"
                    type="text"
                    autoComplete="off"
                    disabled={isSubmitting}
                    component={TextField}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username || ''}
                  />
                </Grid>
                <Grid item sx={{ my: 2, width: '300px' }}>
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
                    onBlur={handleBlur}
                    value={values.email || ''}
                  />
                </Grid>

                <Grid item sx={{ my: 2 }}>
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
                <Grid item sx={{ mb: 2 }}>
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
                        <MenuItem key={role} value={role}>
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
                    startIcon={<EditIcon />}
                    sx={{ mr: 2 }}
                    type="submit"
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    sx={{ mr: 2 }}
                    color="error"
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleClickOpen}
                    // onClick={onDeleteUserClicked}
                  >
                    {`Delete ${values.username}`}
                  </Button>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                      <DialogContentText>
                        {`Delete ${values.username} ?`}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={handleDeleteUser} autoFocus>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item sx={{ mt: 2 }}>
                  {error || delerror ? (
                    <Alert severity="warning">{errContent}</Alert>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
              {/* <Debug /> */}
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
  return content
}

export default EditUserForm
