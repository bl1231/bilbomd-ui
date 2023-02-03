import { useState } from 'react';
import { Formik, Form } from 'formik';
import { userRegisterSchema } from 'schemas/ValidationSchemas';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Container, Stack } from '@mui/system';
import { Alert, AlertTitle, Divider, TextField, Typography } from '@mui/material';
import axios from 'app/api/axios';

const REGISTER_URL = '/register';

const Signup = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
    setStatus({ success: 'Splinching the data...', css: 'sending' });

    const response = await axios
      .post(REGISTER_URL, values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .catch((err) => {
        if (!err?.response) {
          setError({ message: 'No Server Response' });
        } else if (err?.response?.status === 409) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError({ message: 'User Name or Email Already Registered.' });
          setSuccess(null);
          setStatus({ error: err, css: 'error' });
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          setError({ message: 'Registration Failed!' });
        }
      });

    // all good. We got a response from server
    if (response?.data) {
      setError(null);
      setSuccess(response.data.success);
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
        minWidth="200px"
      >
        <Stack spacing={1}>
          {success ? (
            <Alert severity="success">
              <AlertTitle>Woot!</AlertTitle>You have been registered for an account. Before you can
              log in we need you to verify your email. Please check your inbox for a verification
              email from
              <br />
              <strong>bilbomd-noreply@bl1231.als.lbl.gov</strong>
            </Alert>
          ) : (
            <Formik
              initialValues={{ user: '', email: '' }}
              validationSchema={userRegisterSchema}
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
                  <Typography>
                    Select a user name & enter your email address to create a BilboMD account.
                  </Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Pick a User Name"
                    name="user"
                    type="text"
                    variant="outlined"
                    disabled={isSubmitting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.user) && Boolean(touched.user)}
                    helperText={Boolean(errors.user) && Boolean(touched.user) ? errors.user : null}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email address"
                    name="email"
                    type="email"
                    variant="outlined"
                    disabled={isSubmitting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.email) && Boolean(touched.email)}
                    helperText={
                      Boolean(errors.email) && Boolean(touched.email) ? errors.email : null
                    }
                  />
                  {error ? (
                    <Box sx={{ width: '100%' }}>
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
                          sx={{ mb: 2 }}
                        >
                          If you think you already have an account try{' '}
                          <a href="/magicklink" className="alert-link">
                            logging in
                          </a>
                        </Alert>
                      </Collapse>
                    </Box>
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
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Create an Account
                  </Button>
                  <Divider variant="middle" sx={{ my: 3 }} />

                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Already have an account?
                  </Typography>

                  <Button
                    fullWidth
                    sx={{ my: 2 }}
                    variant="contained"
                    type="button"
                    color="secondary"
                    endIcon={<AutoFixHighIcon />}
                    component={Link}
                    to="/magicklink"
                  >
                    Get a MagickLink&#8482;
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default Signup;
