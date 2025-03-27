import { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  TextField,
  MenuItem,
  Alert,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormGroup,
  Select,
  Typography,
  InputLabel,
  OutlinedInput,
  ListItemText
} from '@mui/material'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Field, Form, Formik } from 'formik'
import { format } from 'date-fns'
import {
  User,
  useUpdateUserMutation,
  useDeleteUserMutation
} from 'slices/usersApiSlice'
import { useGetJobsQuery } from 'slices/jobsApiSlice'
import JobSummary from 'features/jobs/JobSummary'
import { ROLES } from 'config/roles'
import { useNavigate } from 'react-router'
import { editUserSchema } from 'schemas/ValidationSchemas'
import { Box } from '@mui/system'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import HeaderBox from 'components/HeaderBox'

interface EditUserFormProps {
  user: User
}

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

interface EditUserFormValues {
  username: string
  email: string
  active: boolean
  roles: string[]
}

const EditUserForm = ({ user }: EditUserFormProps) => {
  const [open, setOpen] = useState(false)

  const { data: jobs } = useGetJobsQuery('jobsList')

  const filteredJobs = jobs
    ? jobs.filter((job) => job.mongo.user._id === user.id)
    : []

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDeleteUser = async () => {
    setOpen(false)
    await deleteUser({ id: user.id })
  }

  const initialValues = {
    username: user.username,
    email: user.email,
    active: user.active,
    roles: user.roles
  }

  const [updateUser, updateResult] = useUpdateUserMutation()

  const [deleteUser, deleteResult] = useDeleteUserMutation()

  const navigate = useNavigate()

  let errContent = ''
  if (updateResult.error || deleteResult.error) {
    const error = updateResult.error || deleteResult.error
    if (
      error &&
      'data' in error &&
      typeof error.data === 'object' &&
      error.data &&
      (error.data as { message: string }).message
    ) {
      errContent = error.data ? (error.data as { message: string }).message : ''
    } else {
      errContent = error?.toString() ?? ''
    }
  }

  useEffect(() => {
    if (updateResult.isSuccess || deleteResult.isSuccess) {
      console.log('about to navigate back to /users')
      navigate('../users')
    }
  }, [updateResult.isSuccess, deleteResult.isSuccess, navigate])

  const myOnSubmit = async (values: EditUserFormValues) => {
    // console.log(values)
    await updateUser({
      id: user.id,
      username: values.username,
      roles: values.roles,
      active: values.active,
      email: values.email
    })
  }

  const content = (
    <>
      <Box>
        <HeaderBox>
          <Typography>Edit User</Typography>
        </HeaderBox>

        <Paper sx={{ p: 1 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={editUserSchema}
            onSubmit={myOnSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              isSubmitting,
              handleChange,
              handleBlur,
              setFieldValue
            }) => (
              <Form>
                <Grid container direction='column'>
                  <Grid sx={{ my: 2, width: '300px' }}>
                    <Field
                      name='username'
                      id='username'
                      label='Username'
                      type='text'
                      autoComplete='off'
                      disabled={isSubmitting}
                      component={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username || ''}
                    />
                  </Grid>
                  <Grid sx={{ my: 2, width: '300px' }}>
                    <Field
                      name='email'
                      id='email'
                      label='Email'
                      type='email'
                      autoComplete='off'
                      fullWidth
                      disabled={isSubmitting}
                      component={TextField}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email || ''}
                    />
                  </Grid>

                  <Grid sx={{ my: 2 }}>
                    <FormLabel component='legend'>
                      Make User active or inactive
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={values.active} />}
                        label='Active'
                        name='active'
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid sx={{ mb: 2 }}>
                    {/* https://github.com/jaredpalmer/formik/issues/2123 */}

                    <FormLabel component='legend'>Assign Roles</FormLabel>
                    <FormControl sx={{ my: 2, width: 300 }}>
                      <InputLabel id='roles'>Roles</InputLabel>
                      <Select
                        labelId='roles'
                        id='roles'
                        multiple={true}
                        value={values.roles}
                        onChange={(e) =>
                          setFieldValue('roles', e.target.value as string)
                        }
                        input={<OutlinedInput label='Roles' />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {Object.values(ROLES).map((role) => (
                          <MenuItem key={role} value={role}>
                            <Checkbox
                              checked={values.roles.indexOf(role) > -1}
                            />
                            <ListItemText primary={role} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid>
                    <Button
                      variant='contained'
                      startIcon={<EditIcon />}
                      sx={{ mr: 2 }}
                      type='submit'
                    >
                      Update
                    </Button>
                    <Button
                      variant='contained'
                      startIcon={<DeleteIcon />}
                      sx={{ mr: 2 }}
                      color='error'
                      type='button'
                      disabled={isSubmitting}
                      onClick={handleClickOpen}
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
                  <Grid sx={{ mt: 2 }}>
                    {errContent ? (
                      <Alert severity='warning'>{errContent}</Alert>
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>

      <Box sx={{ my: 1 }}>
        <HeaderBox>
          <Typography>User Details</Typography>
        </HeaderBox>
        <Paper sx={{ p: 1 }}>
          <Typography>
            <b>Created:</b>{' '}
            {format(new Date(user.createdAt), 'MM/dd/yyyy HH:mm:ss')}
          </Typography>
          <Typography>
            <b>Last Modified:</b>{' '}
            {format(new Date(user.updatedAt), 'MM/dd/yyyy HH:mm:ss')}
          </Typography>
          <Typography>
            <b>UUID:</b> {user.UUID}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ my: 1 }}>
        <HeaderBox>
          <Chip label={`Jobs ${filteredJobs?.length || 0}`} color='success' />
        </HeaderBox>
        <Paper sx={{ p: 1 }}>
          {filteredJobs.length >= 1 ? (
            filteredJobs.map((job, index) => (
              <JobSummary key={index} job={job} />
            ))
          ) : (
            <Typography>No jobs for this user</Typography>
          )}
        </Paper>
      </Box>
      {/* {process.env.NODE_ENV === 'development' ? <Debug /> : ''} */}
    </>
  )
  return content
}

export default EditUserForm
