import { useEffect, useState } from 'react'
import {
  Button,
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
  Typography,
  InputLabel,
  OutlinedInput,
  ListItemText
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Field, Form, Formik } from 'formik'
// import { Debug } from 'components/Debug'
import { format } from 'date-fns'
import { User, useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useGetJobsQuery } from 'features/jobs/jobsApiSlice'
import JobSummary from 'features/jobs/JobSummary'
import { ROLES } from 'config/roles'
import { useNavigate } from 'react-router-dom'
import { editUserSchema } from 'schemas/ValidationSchemas'
import { Box } from '@mui/system'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
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

const EditUserForm = ({ user }: EditUserFormProps) => {
  const [open, setOpen] = useState(false)

  const { data: jobs } = useGetJobsQuery('jobsList', {})

  let filteredJobs
  if (jobs) {
    filteredJobs = jobs.filter((job) => job.user === user.id)
    console.log('got jobs: ', filteredJobs)
  } else {
    console.log('no jobs')
  }

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
    errContent = ((updateResult.error as string) || (deleteResult.error as string)) ?? ''
  }

  useEffect(() => {
    if (updateResult.isSuccess || deleteResult.isSuccess) {
      navigate('../users')
    }
  }, [updateResult.isSuccess, deleteResult.isSuccess, navigate])

  const myOnSubmit = async (values) => {
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
        <Typography sx={HeaderThingee}>Edit User</Typography>
        <Item>
          <Formik
            initialValues={initialValues}
            validationSchema={editUserSchema}
            onSubmit={myOnSubmit}
            enableReinitialize={true}
          >
            {({ values, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
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
                        onChange={(e) => setFieldValue('roles', e.target.value as string)}
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
                    {updateResult.error || deleteResult.error ? (
                      <Alert severity="warning">{errContent}</Alert>
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Item>
      </Box>
      <Box sx={{ my: 1 }}>
        <Typography sx={HeaderThingee}>User Details</Typography>
        <Item>
          <Typography>
            <b>Created:</b> {format(new Date(user.createdAt), 'MM/dd/yyyy HH:mm:ss')}
          </Typography>
          <Typography>
            <b>Last Modified:</b>{' '}
            {format(new Date(user.updatedAt), 'MM/dd/yyyy HH:mm:ss')}
          </Typography>
          <Typography>
            <b>UUID:</b> {user.UUID}
          </Typography>
        </Item>
      </Box>
      <Box sx={{ my: 1 }}>
        <Typography sx={HeaderThingee}>
          <Chip label={`Jobs ${filteredJobs.length}`} color="success" />
        </Typography>
        {filteredJobs.length >= 1 ? (
          <Item>
            {' '}
            {filteredJobs.map((job, index) => (
              <JobSummary key={index} job={job} />
            ))}
          </Item>
        ) : (
          <Item>no jobs for this user</Item>
        )}
      </Box>
      {/* {process.env.NODE_ENV === 'development' ? <Debug /> : ''} */}
    </>
  )
  return content
}

export default EditUserForm
