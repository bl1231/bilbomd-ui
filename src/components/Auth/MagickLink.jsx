import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { userSignInSchema } from 'schemas/ValidationSchemas';
import axios from 'api/axios';
import CustomFormInputs from '../Common/CustomFormInputs';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Container, Stack } from '@mui/system';
import { Alert, AlertTitle, Grid, TextField, Typography } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';

const MAGICKLINK_URL = '/magicklink';

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#101010' : '#fff',
        color: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        p: 1,
        m: 1,
        borderRadius: 1,
        fontFamily: 'Quicksand',
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx
      }}
      {...other}
    />
  );
}

const MagickLink = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = async (values, { setStatus, resetForm, setSubmitting }) => {
    setStatus({ success: 'Splinching the data...', css: 'sending' });
    const response = await axios
      .post(MAGICKLINK_URL, values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .catch((err) => {
        if (!err?.response) {
          setError({ messge: 'No Server Response' });
        } else if (err?.response?.status) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError({
            message: 'You must register and verify your email first.'
          });
          setSuccess(null);
          setStatus({ error: err, css: 'error' });
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        }
      });
    if (response?.data) {
      setError(null);
      setSuccess(response.data.success);
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Stack spacing={1}>
          {success ? (
            <Alert severity="success">
              <AlertTitle>Woot!</AlertTitle>A MagickLink&#8482; has been
              generated and sent to your email address.
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
                  {/* <CustomFormInputs
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="enter email address"
                  /> */}
                  <Typography justifyContent="center">
                    Enter your email address to sign in to BilboMD
                  </Typography>
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
                      Boolean(errors.email) && Boolean(touched.email)
                        ? errors.email
                        : null
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
                          If you need an account please{' '}
                          <a href="/register" className="alert-link">
                            register
                          </a>
                        </Alert>
                      </Collapse>
                    </Box>
                  ) : (
                    <></>
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
                    Send my MagickLink&#8482;
                  </Button>
                  <Divider variant="middle" />

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
          {/* <Divider variant="middle" />
          <Button
            fullWidth
            variant="contained"
            type="button"
            endIcon={<ChevronRightIcon />}
          >
            Create an Account
          </Button> */}
        </Stack>
      </Box>
    </Container>
  );
};

export default MagickLink;
