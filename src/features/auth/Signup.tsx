import { useState } from 'react'
import { Formik, Form } from 'formik'
import { userRegisterSchema } from 'schemas/ValidationSchemas'
import { Link } from 'react-router'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  AlertTitle,
  Divider,
  TextField,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import useTitle from 'hooks/useTitle'
import { axiosInstance, isAxiosError } from 'app/api/axios'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { Debug } from 'components/Debug'

const Signup = () => {
  useTitle('BilboMD: Signup')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const { data: config, error: configError, isLoading } = useGetConfigsQuery({})
  if (isLoading) return <div>Loading config data...</div>
  if (configError) return <div>Error loading configuration data</div>
  if (!config) return <div>No configuration data available</div>

  const onSubmit = async (
    values: { user: string; email: string },
    {
      resetForm,
      setSubmitting,
      setErrors
    }: {
      resetForm: () => void
      setSubmitting: (isSubmitting: boolean) => void
      setErrors: (errors: { [key: string]: string }) => void
    }
  ) => {
    try {
      const response = await axiosInstance.post('/register', values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      // console.log('response: ', response)
      if (response.status === 201) {
        // successfully created a new user
        setError('')
        setErrors({})
        setSuccess(response.data.success)
        setSubmitting(false)
        resetForm()
      }
    } catch (error) {
      if (isAxiosError(error)) {
        // Access to config, request, and response
        console.error('Axios Error: ', error)
        if (!error.response) {
          setError('No Server Response')
        } else if (error.response.status === 409) {
          setError(error.response.data.message)
        }
        setSubmitting(false)
      } else {
        console.error(error)
      }
    }
  }

  const content = (
    <>
      <Grid
        container
        columns={12}
        direction='row'
        sx={{ height: '100vh' }}
        alignItems='center'
        justifyContent='center'
      >
        <Grid
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: '#bfbfbf',
            borderRadius: 1,
            width: '400px'
          }}
        >
          {success ? (
            <Alert severity='success'>
              <AlertTitle>Woot!</AlertTitle>You have been registered for an
              account. Before you can log in we need you to verify your email.
              Please check your inbox for a verification email from
              <br />
              <strong>{config.sendMailUser}</strong>
            </Alert>
          ) : (
            <Formik
              initialValues={{ user: '', email: '' }}
              validationSchema={userRegisterSchema}
              onSubmit={onSubmit}
            >
              {({
                errors,
                touched,
                isSubmitting,
                handleChange,
                handleBlur
              }) => (
                <Form>
                  <Typography sx={{ my: 2 }}>
                    Select a user name and enter your email address to create a{' '}
                    <b>BilboMD</b> account.
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{ my: 1 }}
                    label='Pick a User Name'
                    name='user'
                    type='text'
                    variant='outlined'
                    disabled={isSubmitting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.user) && Boolean(touched.user)}
                    helperText={
                      Boolean(errors.user) && Boolean(touched.user)
                        ? errors.user
                        : null
                    }
                  />
                  <TextField
                    fullWidth
                    sx={{ my: 1 }}
                    label='Enter an Email address'
                    name='email'
                    type='email'
                    variant='outlined'
                    disabled={isSubmitting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.email) && Boolean(touched.email)}
                    helperText={
                      Boolean(errors.email) && Boolean(touched.email)
                        ? errors.email
                        : null
                    }
                  />
                  {error ? (
                    <Collapse in={Boolean(error)}>
                      <Alert
                        severity='error'
                        action={
                          <IconButton
                            aria-label='close'
                            color='inherit'
                            size='small'
                            onClick={() => setError('')}
                          >
                            <CloseIcon fontSize='inherit' />
                          </IconButton>
                        }
                        sx={{ mb: 1 }}
                      >
                        {error}
                        <br /> If you have an account{' '}
                        <Link to='../magicklink' className='alert-link'>
                          get a MagickLink&#8482;
                        </Link>
                      </Alert>
                    </Collapse>
                  ) : (
                    ''
                  )}

                  <Button
                    fullWidth
                    sx={{ my: 2 }}
                    variant='contained'
                    type='submit'
                    disabled={isSubmitting}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Create an Account
                  </Button>
                  <Divider variant='middle' sx={{ my: 3 }} />

                  <Typography variant='body2' sx={{ mt: 2 }}>
                    Already have an account?
                  </Typography>

                  <Button
                    fullWidth
                    sx={{ my: 2 }}
                    variant='contained'
                    type='button'
                    endIcon={<AutoFixHighIcon />}
                    component={Link}
                    to='../magicklink'
                  >
                    Get a MagickLink&#8482;
                  </Button>
                  {process.env.NODE_ENV === 'development' ? <Debug /> : ''}
                </Form>
              )}
            </Formik>
          )}
        </Grid>
      </Grid>
    </>
  )

  return content
}

export default Signup
