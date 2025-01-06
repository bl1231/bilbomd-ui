import { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Link as RouterLink } from 'react-router'
import { Form, Formik, Field } from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewAutoJobMutation } from '../../slices/jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import NewAutoJobFormInstructions from './NewAutoJobFormInstructions'
import { BilboMDAutoJobSchema } from 'schemas/BilboMDAutoJobSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import useTitle from 'hooks/useTitle'
import NerscStatusChecker from 'features/nersc/NerscStatusChecker'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useTheme } from '@mui/material/styles'

interface SubmitValues {
  title: string
  pdb_file: string
  pae_file: string
  dat_file: string
  email: string
}

const PipelineSchematic = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Grid size={{ xs: 12 }}>
    <HeaderBox>
      <Typography>BilboMD SANS Schematic</Typography>
    </HeaderBox>
    <Paper sx={{ p: 2 }}>
      <img
        src={
          isDarkMode
            ? '/images/bilbomd-auto-schematic-dark.png'
            : '/images/bilbomd-auto-schematic.png'
        }
        alt='Overview of BilboMD AF pipeline'
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Paper>
  </Grid>
)

const NewAutoJobForm = () => {
  useTitle('BilboMD: New Auto Job')
  const [addNewAutoJob, { isSuccess }] = useAddNewAutoJobMutation()
  const { email } = useAuth()
  const [isPerlmutterUnavailable, setIsPerlmutterUnavailable] = useState(false)

  // Fetch the configuration object
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  if (configIsLoading) return <LinearProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'

  const handleStatusCheck = (isUnavailable: boolean) => {
    // Update the state based on the system's availability
    setIsPerlmutterUnavailable(isUnavailable)
  }

  const initialValues: SubmitValues = {
    title: '',
    pdb_file: '',
    pae_file: '',
    dat_file: '',
    email: email
  }

  const onSubmit = async (
    values: SubmitValues,
    { setStatus }: { setStatus: (status: string) => void }
  ) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('pdb_file', values.pdb_file)
    form.append('dat_file', values.dat_file)
    form.append('pae_file', values.pae_file)
    form.append('email', values.email)
    form.append('bilbomd_mode', 'auto')

    try {
      const newJob = await addNewAutoJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const isFormValid = (values: SubmitValues) => {
    return (
      !isPerlmutterUnavailable &&
      values.title !== '' &&
      values.pdb_file !== '' &&
      values.pae_file !== '' &&
      values.dat_file !== ''
    )
  }

  const content = (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <NewAutoJobFormInstructions />
        </Grid>

        <PipelineSchematic isDarkMode={isDarkMode} />

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>BilboMD Auto Job Form</Typography>
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
              <Formik
                initialValues={initialValues}
                validationSchema={BilboMDAutoJobSchema}
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
                          fileType='AlphaFold2 *.pdb'
                          fileExt='.pdb'
                        />
                      </Grid>

                      <Grid>
                        <Field
                          name='pae_file'
                          id='pae-file-upload'
                          as={FileSelect}
                          title='Select File'
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.pae_file && touched.pae_file}
                          errorMessage={errors.pae_file ? errors.pae_file : ''}
                          fileType='AlphaFold2 PAE *.json'
                          fileExt='.json'
                        />
                      </Grid>
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
                          fileType='experimental SAXS data *.dat'
                          fileExt='.dat'
                        />
                      </Grid>

                      {isSubmitting && (
                        <Box sx={{ my: 1, width: '520px' }}>
                          <LinearProgress />
                        </Box>
                      )}
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

export default NewAutoJobForm
