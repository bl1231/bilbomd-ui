import { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper
} from '@mui/material'
// import { Add, Delete } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'
import { Link as RouterLink } from 'react-router-dom'
import { Form, Formik, Field } from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewSANSJobMutation } from 'slices/jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { BilboMDSANSJobSchema } from 'schemas/BilboMDSANSJobSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import useTitle from 'hooks/useTitle'
import { NewSANSJobFormValues } from '../../types/sansForm'
import NewSANSJobFormInstructions from './NewSANSJobFormInstructions'
import NerscStatusChecker from 'features/nersc/NerscStatusChecker'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const NewSANSJob = () => {
  useTitle('BilboMD: New SANS Job')
  const [addNewSANSJob, { isSuccess }] = useAddNewSANSJobMutation()
  const { email } = useAuth()
  const [isPerlmutterUnavailable, setIsPerlmutterUnavailable] = useState(false)

  // Fetch the configuration object
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})

  if (configIsLoading) return <LinearProgress />

  if (configError)
    return <Alert severity='error'>Error loading configuration</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'

  const handleStatusCheck = (isUnavailable: boolean) => {
    // Update the state based on the system's availability
    setIsPerlmutterUnavailable(isUnavailable)
  }
  const initialValues = {
    title: '',
    dat_file: '',
    email: email
  }

  const onSubmit = async (values, { setStatus }) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('dat_file', values.dat_file)
    form.append('email', values.email)
    form.append('bilbomd_mode', 'sans')

    try {
      const newJob = await addNewSANSJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }
  const isFormValid = (values) => {
    return (
      !isPerlmutterUnavailable && values.title !== '' && values.dat_file !== ''
    )
  }
  const content = (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <NewSANSJobFormInstructions />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>BilboMD SANS Job Form</Typography>
          </HeaderBox>
          <Paper sx={{ p: 2 }}>
            {isSuccess ? (
              <Alert severity='success'>
                <AlertTitle>Woot!</AlertTitle>
                <Typography>
                  Your job has been submitted. Check out the{' '}
                  <RouterLink to='../jobs'>details</RouterLink>.
                </Typography>
              </Alert>
            ) : (
              <Formik<NewSANSJobFormValues>
                initialValues={initialValues}
                validationSchema={BilboMDSANSJobSchema}
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
                  status,
                  setFieldValue,
                  setFieldTouched
                }) => (
                  <Form>
                    <Grid container direction='column'>
                      {useNersc && (
                        <NerscStatusChecker
                          systemName='perlmutter'
                          onStatusCheck={handleStatusCheck}
                        />
                      )}
                      {/* Title */}
                      <Grid sx={{ my: 2, width: '520px' }}>
                        <Field
                          fullWidth
                          label='Title'
                          name='title'
                          id='title'
                          type='text'
                          disabled={isSubmitting}
                          as={TextField}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.title && touched.title}
                          helperText={
                            errors.title && touched.title ? errors.title : ''
                          }
                          value={values.title || ''}
                        />
                      </Grid>

                      {/* SANS dat file */}
                      <Grid>
                        <Field
                          name='dat_file'
                          id='dat-file-upload'
                          as={FileSelect}
                          title='Select File'
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.dat_file && touched.dat_file}
                          errorMessage={errors.dat_file ? errors.dat_file : ''}
                          fileType='experimental SANS data *.dat'
                          fileExt='.dat'
                        />
                      </Grid>
                      {/* Progress Bar */}
                      {isSubmitting && (
                        <Box sx={{ my: 1, width: '520px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      {/* Submit Button */}
                      <Grid sx={{ mt: 2 }}>
                        <LoadingButton
                          type='submit'
                          disabled={
                            !isValid || isSubmitting || !isFormValid(values)
                          }
                          loading={isSubmitting}
                          endIcon={<SendIcon />}
                          loadingPosition='end'
                          variant='contained'
                          sx={{ width: '110px' }}
                        >
                          <span>Submit</span>
                        </LoadingButton>

                        {isSuccess ? (
                          <Alert severity='success'>{status}</Alert>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </Grid>
                    {process.env.NODE_ENV === 'development' ? <Debug /> : ''}
                  </Form>
                )}
              </Formik>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  )

  return content
}

export default NewSANSJob
