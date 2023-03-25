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

const MagickLink = () => {
  useTitle('BilboMD: Get a MagickLink')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')

  const onSubmit = async (values, { setStatus, resetForm, setSubmitting }) => {
    setStatus({ success: 'Splinching the data...', css: 'sending' })
    const response = await axios
      .post(MAGICKLINK_URL, values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .catch((err) => {
        if (!err?.response) {
          setError({ messge: 'No Server Response' })
        } else if (err?.response?.status) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError({
            message: 'You must register and verify your email first.'
          })
          setSuccess(null)
          setStatus({ error: err, css: 'error' })
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        }
      })
    if (response?.data) {
      setError(null)
      setSuccess(response.data.success)
      setSubmitting(false)
      resetForm()
    }
  }

  return (
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
          xs={4}
          sx={{
            p: 2,
            bgcolor: 'background.login',
            border: 1,
            borderRadius: 1,
            borderColor: 'secondary.main'
          }}
        >
          {success ? (
            <Alert severity="success">
              <AlertTitle>Woot!</AlertTitle>A MagickLink&#8482; has been generated and
              sent to your email address.
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
                isValid,
                isSubmitting,
                handleChange,
                handleBlur,
                resetForm
              }) => (
                <Form>
                  <Typography sx={{ my: 2 }}>
                    Enter your email address to sign in to <b>BilboMD</b>
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{
                      my: 2,
                      bgcolor: 'background.paper',
                      border: 1,
                      borderRadius: 1,
                      borderColor: 'secondary.main'
                    }}
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
                    <Collapse in={error}>
                      <Alert
                        severity="error"
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
                        If you need an account please{' '}
                        <a href="/register" className="alert-link">
                          register
                        </a>
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
                    to="/register"
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

export default MagickLink
