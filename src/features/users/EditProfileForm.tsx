import { useState, useEffect } from 'react'
import { Button, Grid, TextField, Alert, Typography, Paper } from '@mui/material'
import { Formik, Field, Form } from 'formik'
import { useNavigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import { userProfileSchema } from '../../schemas/ProfileSchema'
import { useGetUserByIdQuery, useUpdateUserMutation } from './usersApiSlice'

interface EditProfileFormProps {
  username: string
  email: string
}

const EditProfileForm = () => {
  const navigate = useNavigate()
  const { id } = useAuth()
  const { data: user, error: userError, isLoading } = useGetUserByIdQuery({ id })
  const [updateUser, { isSuccess, isError, error }] = useUpdateUserMutation()

  // State to hold form initialValues
  const [initialValues, setInitialValues] = useState({
    username: '',
    email: ''
  })

  // Update initialValues when user data is fetched
  useEffect(() => {
    if (user) {
      setInitialValues({
        username: user.username,
        email: user.email
      })
      console.log('in EditProfileForm', user)
    }
  }, [user])

  useEffect(() => {
    if (isSuccess) {
      console.log('Profile updated successfully')
      navigate('/dashboard')
    }
  }, [isSuccess, navigate])

  const handleOnSubmit = async (values: EditProfileFormProps) => {
    console.log('handleOnSubmit values: ', values)
    await updateUser({
      id: user._id,
      username: values.username,
      roles: user.roles,
      active: user.active,
      email: values.email
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (userError) {
    return <Alert severity="error">Error loading user data</Alert>
  }

  return (
    <Paper sx={{ p: 3, margin: 'auto', maxWidth: 500, flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Edit Profile
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={userProfileSchema}
        onSubmit={handleOnSubmit}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          isValid
        }) => (
          <Form>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <Field
                  name="username"
                  as={TextField}
                  label="Username"
                  fullWidth
                  disabled={isSubmitting}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.username && touched.username}
                  helperText={errors.username && touched.username ? errors.username : ''}
                  value={values.username || ''}
                />
              </Grid>
              <Grid item>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  disabled={isSubmitting}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email}
                  helperText={errors.email && touched.email ? errors.email : ''}
                  value={values.email || ''}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                >
                  Update Profile
                </Button>
              </Grid>
              {isError && (
                <Grid item>
                  <Alert severity="error">{`Error: ${error}`}</Alert>
                </Grid>
              )}
            </Grid>
            {process.env.NODE_ENV === 'development' ? <Debug /> : ''}
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default EditProfileForm
