import { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  Slider,
  Chip
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
    pdb_file: '',
    dat_file: '',
    inp_file: '',
    email: email,
    d2o_fraction: 0,
    deuteration_fraction: 0
  }

  const onSubmit = async (values, { setStatus }) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('pdb_file', values.pdb_file)
    form.append('dat_file', values.dat_file)
    form.append('inp_file', values.inp_file)
    form.append('d2o_fraction', values.d2o_fraction)
    form.append('deuteration_fraction', values.deuteration_fraction)
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
      !isPerlmutterUnavailable &&
      values.title !== '' &&
      values.pdb_file !== '' &&
      values.dat_file !== '' &&
      values.inp_file !== '' &&
      values.d2o_fraction >= 0 &&
      values.d2o_fraction <= 100 &&
      values.deuteration_fraction >= 0 &&
      values.deuteration_fraction <= 100
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

                      {/* PDB file */}
                      <Grid>
                        <Field
                          name='pdb_file'
                          id='pdb-file-upload'
                          as={FileSelect}
                          title='Select File'
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.pdb_file && touched.pdb_file}
                          errorMessage={errors.pdb_file ? errors.pdb_file : ''}
                          fileType='Starting PDB file *.pdb'
                          fileExt='.pdb'
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

                      {/* const.inp file */}
                      <Grid>
                        <Field
                          name='inp_file'
                          id='const-inp-file-upload'
                          as={FileSelect}
                          title='Select File'
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.inp_file && touched.inp_file}
                          errorMessage={errors.inp_file ? errors.inp_file : ''}
                          fileType='CHARMM const.inp file'
                          fileExt='.inp'
                        />
                      </Grid>

                      {/* D2O Fraction Slider */}
                      <Grid sx={{ my: 2, width: '520px' }}>
                        <Box display='flex' alignItems='center'>
                          <Typography id='d2o-fraction-slider' gutterBottom>
                            D2O Fraction
                          </Typography>
                          <Chip
                            label={`${values.d2o_fraction}%`}
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        <Slider
                          aria-labelledby='d2o-fraction-slider'
                          name='d2o_fraction'
                          value={values.d2o_fraction}
                          onChange={(event, value) => {
                            setFieldValue('d2o_fraction', value)
                          }}
                          min={0}
                          max={100}
                          step={1}
                          marks
                          valueLabelDisplay='off'
                          disabled={isSubmitting}
                        />
                        {errors.d2o_fraction && touched.d2o_fraction ? (
                          <Typography color='error'>
                            {errors.d2o_fraction}
                          </Typography>
                        ) : null}
                      </Grid>

                      {/* Deuteration Fraction Slider */}
                      <Grid sx={{ my: 2, width: '520px' }}>
                        <Box display='flex' alignItems='center'>
                          <Typography
                            id='deuteration-fraction-slider'
                            gutterBottom
                          >
                            Deuteration Fraction
                          </Typography>
                          <Chip
                            label={`${values.deuteration_fraction}%`}
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        <Slider
                          aria-labelledby='deuteration-fraction-slider'
                          name='deuteration_fraction'
                          value={values.deuteration_fraction}
                          onChange={(event, value) => {
                            setFieldValue('deuteration_fraction', value)
                          }}
                          min={0}
                          max={100}
                          step={1}
                          marks
                          valueLabelDisplay='off'
                          disabled={isSubmitting}
                        />
                        {errors.deuteration_fraction &&
                        touched.deuteration_fraction ? (
                          <Typography color='error'>
                            {errors.deuteration_fraction}
                          </Typography>
                        ) : null}
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
