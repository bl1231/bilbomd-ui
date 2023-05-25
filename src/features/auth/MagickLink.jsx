import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { userSignInSchema } from 'schemas/ValidationSchemas'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, AlertTitle, TextField, Typography, Grid } from '@mui/material'
import Divider from '@mui/material/Divider'
import { Link } from 'react-router-dom'
import useTitle from 'hooks/useTitle'
import axios from 'app/api/axios'

const MAGICKLINK_URL = '/magicklink'
const VERIFICATION_CODE_URL = '/verify/resend'

const MagickLink = () => {
  useTitle('BilboMD: Get a MagickLink')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState('')

  const onSubmit = async (values, { setStatus, resetForm, setSubmitting }) => {
    setStatus({ success: 'Splinching the data...', css: 'sending' })
    const response = await axios
      .post(MAGICKLINK_URL, values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .catch((err) => {
        if (!err?.response) {
          setError({ message: 'No Server Response' })
        } else if (err?.response?.status) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // error message from backend available in data.message
          //console.log(err.response)
          setError({
            message: err.response.data.message
          })
          setSuccess(null)
          setStatus({ error: err, css: 'error' })
          // console.log(err.response.data.message)
          // console.log(err.response.status)
          // console.log(err.response.headers)
        }
      })
    if (response?.data) {
      setError(null)
      setSuccess(response.data.success)
      setSubmitting(false)
      resetForm()
    }
  }

  const resendVerificationCode = async (email) => {
    // console.log('resend code for:', email)
    await axios
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
        direction="row"
        sx={{ height: '100vh' }}
        alignItems="center"
        justifyContent="center"
      >
        <React.Fragment>
          <Alert severity="success" variant="outlined">
            <AlertTitle>Woot!</AlertTitle>A new email verification code has been sent to{' '}
            <strong>{verifyEmail}</strong>.<br /> Please check your inbox and perhaps your
            Spam folder for an email from{' '}
            <strong>{import.meta.env.VITE_SENDMAIL_USER}</strong>
          </Alert>
        </React.Fragment>
      </Grid>
    )
  } else {
    content = (
      <React.Fragment>
        <Grid
          container
          columns={12}
          direction="row"
          sx={{ height: '100vh' }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            item
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              border: 1,
              borderRadius: 1,
              borderColor: 'secondary.main',
              width: '400px'
            }}
          >
            {success ? (
              <Alert severity="success">
                <AlertTitle>Woot!</AlertTitle>A MagickLink&#8482; has been generated.
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
                      label="Email address"
                      name="email"
                      type="email"
                      variant="outlined"
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
                          severity={error.message == 'Pending' ? 'warning' : 'error'}
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => setError('')}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                          sx={{ mb: 1 }}
                        >
                          {error.message == 'Pending' ? (
                            <React.Fragment>
                              <Typography>Please verify your email first</Typography>
                              <Button
                                variant="outlined"
                                type="button"
                                sx={{ my: 1 }}
                                onClick={() => {
                                  setVerifyEmail(values.email)
                                  resendVerificationCode(values.email)
                                }}
                              >
                                Resend Verification Code
                              </Button>
                            </React.Fragment>
                          ) : (
                            error.message
                          )}
                        </Alert>
                      </Collapse>
                    ) : (
                      ''
                    )}

                    <Button
                      fullWidth
                      sx={{ my: 2 }}
                      variant="contained"
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                      startIcon={<AutoFixHighIcon />}
                    >
                      Send a MagickLink&#8482;
                    </Button>
                    <Divider variant="middle" sx={{ my: 3 }} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Need an account?
                    </Typography>
                    <Button
                      fullWidth
                      sx={{ my: 2 }}
                      variant="contained"
                      type="button"
                      color="secondary"
                      endIcon={<ChevronRightIcon />}
                      component={Link}
                      to="../register"
                    >
                      Create an Account
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  return content
}

export default MagickLink
