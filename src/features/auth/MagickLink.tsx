import { useState } from 'react'
import { Formik, Form } from 'formik'
import { userSignInSchema } from 'schemas/ValidationSchemas'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, AlertTitle, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Link } from 'react-router'
import useTitle from 'hooks/useTitle'
import { axiosInstance } from 'app/api/axios'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

const MAGICKLINK_URL = '/magicklink'
const VERIFICATION_CODE_URL = '/verify/resend'

const MagickLink = () => {
  useTitle('BilboMD: Get a MagickLink')

  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState('')

  const {
    data: config,
    error: configError,
    isLoading
  } = useGetConfigsQuery('configData')

  if (isLoading) return <div>Loading config data...</div>

  if (configError) {
    let errorMessage = 'An unexpected error occurred'

    if ('status' in configError) {
      // Handle FetchBaseQueryError
      const fetchError = configError as FetchBaseQueryError
      errorMessage = `Error ${fetchError.status}: ${
        'data' in fetchError &&
        typeof fetchError.data === 'object' &&
        fetchError.data !== null
          ? JSON.stringify(fetchError.data)
          : 'No additional error information'
      }`
    } else if ('message' in configError) {
      // Handle SerializedError
      const serializedError = configError as SerializedError
      errorMessage = serializedError.message || errorMessage
    }

    return <div>Error loading configuration data: {errorMessage}</div>
  }
  if (!config) return <div>No configuration data available</div>

  const onSubmit = async (
    values: { email: string },
    {
      setStatus,
      resetForm,
      setSubmitting
    }: {
      setStatus: (status: string | null) => void
      resetForm: () => void
      setSubmitting: (isSubmitting: boolean) => void
    }
  ) => {
    setStatus('Splinching the data...')
    const response = await axiosInstance
      .post(MAGICKLINK_URL, values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .catch((err) => {
        if (!err?.response) {
          setError('No Server Response')
        } else if (err?.response?.status) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // error message from backend available in data.message
          //console.log(err.response)
          setError(err.response.data.message)
          setSuccess(null)
          setStatus(err)
          // console.log(err.response.data.message)
          // console.log(err.response.status)
          // console.log(err.response.headers)
        }
      })
    if (response?.data) {
      // setError({}})
      setSuccess(response.data.success)
      setSubmitting(false)
      resetForm()
    }
  }

  const resendVerificationCode = async (email: string) => {
    // console.log('resend code for:', email)
    await axiosInstance
      .post(
        VERIFICATION_CODE_URL,
        { email: email },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      .then((res) => {
        console.log('done', res.status, res.data.message)
        setVerified(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  let content

  if (verified) {
    content = (
      <Grid
        container
        columns={12}
        direction='row'
        sx={{ height: '100vh' }}
        alignItems='center'
        justifyContent='center'
      >
        <>
          <Alert severity='success' variant='outlined'>
            <AlertTitle>Woot!</AlertTitle>A new email verification code has been
            sent to <strong>{verifyEmail}</strong>.<br /> Please check your
            inbox and perhaps your Spam folder for an email from{' '}
            <strong>{config.sendMailUser}</strong>
          </Alert>
        </>
      </Grid>
    )
  } else {
    content = (
      <>
        {/* Configurable Alert on Login Page */}
        <Grid container justifyContent='center'>
          {config.enableHomePageAlert === 'true' && (
            <Grid>
              <Alert severity='error' variant='filled' sx={{ my: 2 }}>
                <AlertTitle>Important Notice</AlertTitle>
                An unplanned power outage on Feb 15th has resulted in the{' '}
                <strong>loss of all user accounts</strong>. If you had an
                account, you will need to <strong>register again</strong>. We
                sincerely apologize for the inconvenience.
              </Alert>
            </Grid>
          )}
        </Grid>
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
              bgcolor: 'background.paper',
              border: 1,
              borderRadius: 1,
              width: '400px'
            }}
          >
            {success ? (
              <Alert severity='success'>
                <AlertTitle>Woot!</AlertTitle>A MagickLink&#8482; has been
                generated.
                <br />
                <strong>Please check your inbox.</strong>
              </Alert>
            ) : (
              <Formik
                initialValues={{ email: '' }}
                validationSchema={userSignInSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  handleChange,
                  handleBlur
                }) => (
                  <Form>
                    <Typography sx={{ my: 2 }}>
                      Enter your email address to sign in to <b>BilboMD</b>
                    </Typography>
                    <TextField
                      fullWidth
                      sx={{ my: 1 }}
                      label='Email address'
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
                          severity={error == 'Pending' ? 'warning' : 'error'}
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
                          {error == 'Pending' ? (
                            <>
                              <Typography>
                                Please verify your email first
                              </Typography>
                              <Button
                                variant='outlined'
                                type='button'
                                sx={{ my: 1 }}
                                onClick={() => {
                                  setVerifyEmail(values.email)
                                  resendVerificationCode(values.email)
                                }}
                              >
                                Resend Verification Code
                              </Button>
                            </>
                          ) : (
                            error
                          )}
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
                      color='primary'
                      disabled={isSubmitting}
                      startIcon={<AutoFixHighIcon />}
                    >
                      Send a MagickLink&#8482;
                    </Button>
                    <Divider variant='middle' sx={{ my: 3 }} />
                    <Typography variant='body2' sx={{ mt: 2 }}>
                      Need an account?
                    </Typography>
                    <Button
                      fullWidth
                      sx={{ my: 2 }}
                      variant='contained'
                      type='button'
                      endIcon={<ChevronRightIcon />}
                      component={Link}
                      to='../register'
                    >
                      Create an Account
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Grid>
        </Grid>
      </>
    )
  }

  return content
}

export default MagickLink
