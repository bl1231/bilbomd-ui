import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  TextField,
  MenuItem,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  FormGroup,
  FormControlLabel,
  Divider,
  LinearProgress
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link as RouterLink } from 'react-router'
import {
  Form,
  Formik,
  Field,
  FormikHelpers,
  FormikErrors,
  FormikTouched
} from 'formik'
import {
  useAddNewJobMutation,
  useCalculateAutoRgMutation
} from 'slices/jobsApiSlice'
import SendIcon from '@mui/icons-material/Send'
import { expdataSchema } from 'schemas/ExpdataSchema'
import { BilboMDClassicJobSchema } from 'schemas/BilboMDClassicJobSchema'
import useAuth from 'hooks/useAuth'
import HeaderBox from 'components/HeaderBox'
import NerscStatusChecker from 'features/nersc/NerscStatusChecker'
import FileSelect from './FileSelect'
import { Debug } from 'components/Debug'
import NewJobFormInstructions from './NewJobFormInstructions'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useTheme } from '@mui/material/styles'
import PipelineSchematic from './PipelineSchematic'

const NewJobForm = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [addNewJob, { isSuccess }] = useAddNewJobMutation()
  const [calculateAutoRg, { isLoading }] = useCalculateAutoRgMutation()
  const { email } = useAuth()

  const [isPerlmutterUnavailable, setIsPerlmutterUnavailable] = useState(false)
  const [selectedMode, setSelectedMode] = useState('pdb')

  // Fetch the configuration object
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData')

  if (configIsLoading) return <LinearProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'

  const handleStatusCheck = (isUnavailable: boolean) => {
    // Update the state based on the system's availability
    setIsPerlmutterUnavailable(isUnavailable)
  }

  const initialValues = {
    bilbomd_mode: 'pdb',
    title: '',
    psf_file: '',
    crd_file: '',
    pdb_file: '',
    constinp: '',
    expdata: '',
    num_conf: '',
    rg: '',
    rg_min: '',
    rg_max: '',
    email: email
  }

  const onSubmit = async (
    values: typeof initialValues,
    { setStatus }: { setStatus: (status: string) => void }
  ) => {
    const form = new FormData()
    form.append('bilbomd_mode', values.bilbomd_mode)
    form.append('title', values.title)
    form.append('psf_file', values.psf_file)
    form.append('crd_file', values.crd_file)
    form.append('pdb_file', values.pdb_file)
    form.append('num_conf', values.num_conf)
    form.append('rg', values.rg)
    form.append('rg_min', values.rg_min)
    form.append('rg_max', values.rg_max)
    form.append('expdata', values.expdata)
    form.append('constinp', values.constinp)
    form.append('email', values.email)

    try {
      const newJob = await addNewJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const handleCheckboxChange =
    (
      resetForm: FormikHelpers<typeof initialValues>['resetForm'],
      values: typeof initialValues,
      validateForm: (
        values?: Partial<typeof initialValues>
      ) => Promise<FormikErrors<typeof initialValues>>,
      touched: FormikTouched<typeof initialValues>
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newBilboMDMode =
        event.target.name === 'pdb_inputs' ? 'pdb' : 'crd_psf'

      setSelectedMode(newBilboMDMode)

      if (newBilboMDMode === 'pdb') {
        console.log('reset to PDB mode')
        resetForm({
          values: {
            ...values,
            crd_file: '',
            psf_file: '',
            bilbomd_mode: 'pdb'
          },
          errors: {},
          touched: { ...touched }
        })
      } else {
        console.log('reset to CRD/PSF mode')
        resetForm({
          values: { ...values, pdb_file: '', bilbomd_mode: 'crd_psf' },
          errors: {},
          touched: { ...touched }
        })
      }
      // Delay validation to ensure form state has been updated
      setTimeout(() => {
        validateForm()
      }, 0)
    }

  const isFormValid = (values: typeof initialValues) => {
    return (
      !isPerlmutterUnavailable &&
      values.title !== '' &&
      values.constinp !== '' &&
      values.expdata !== '' &&
      values.rg_max !== '' &&
      values.rg_min !== '' &&
      values.num_conf !== '' &&
      (values.bilbomd_mode === 'pdb'
        ? values.pdb_file !== ''
        : values.psf_file !== '' && values.crd_file !== '')
    )
  }

  const content = (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <NewJobFormInstructions />
      </Grid>

      <PipelineSchematic isDarkMode={isDarkMode} pipeline={selectedMode} />

      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Typography>BilboMD Classic Job Form</Typography>
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
              validationSchema={BilboMDClassicJobSchema}
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
                setFieldTouched,
                resetForm,
                validateForm
              }) => (
                <Form>
                  <Grid
                    container
                    columns={12}
                    direction='column'
                    sx={{ display: 'flex' }}
                  >
                    {useNersc && (
                      <NerscStatusChecker
                        systemName='perlmutter'
                        onStatusCheck={handleStatusCheck}
                      />
                    )}
                    <Divider textAlign='left' sx={{ my: 1 }}>
                      Model Inputs
                    </Divider>
                    <Grid
                      container
                      direction='row'
                      alignItems='center'
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '520px'
                      }}
                    >
                      <Grid size={{ xs: 6 }}>
                        <FormGroup sx={{ ml: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.bilbomd_mode === 'pdb'}
                                onChange={handleCheckboxChange(
                                  resetForm,
                                  values,
                                  validateForm,
                                  touched
                                )}
                                name='pdb_inputs'
                              />
                            }
                            label='PDB file'
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.bilbomd_mode === 'crd_psf'}
                                onChange={handleCheckboxChange(
                                  resetForm,
                                  values,
                                  validateForm,
                                  touched
                                )}
                                name='crd_psf_inputs'
                              />
                            }
                            label='CRD/PSF files'
                          />
                        </FormGroup>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Alert severity='info'>
                          If you used CHARMM-GUI to parameterize your inputs
                          then please select the CRD/PSF option
                        </Alert>
                      </Grid>
                    </Grid>
                    <Divider textAlign='left' sx={{ my: 1 }}>
                      Job Form
                    </Divider>
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
                    {values.bilbomd_mode === 'crd_psf' && (
                      <>
                        <Grid
                          container
                          direction='row'
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '520px'
                          }}
                        >
                          <Grid>
                            <Field
                              name='crd_file'
                              id='crd-file-upload'
                              as={FileSelect}
                              title='Select File'
                              disabled={isSubmitting}
                              setFieldValue={setFieldValue}
                              setFieldTouched={setFieldTouched}
                              error={errors.crd_file && touched.crd_file}
                              errorMessage={
                                errors.crd_file ? errors.crd_file : ''
                              }
                              fileType='CHARMM-GUI *.crd'
                              fileExt='.crd'
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction='row'
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '520px'
                          }}
                        >
                          <Grid>
                            <Field
                              name='psf_file'
                              id='psf-file-upload'
                              as={FileSelect}
                              title='Select File'
                              disabled={isSubmitting}
                              setFieldValue={setFieldValue}
                              setFieldTouched={setFieldTouched}
                              error={errors.psf_file && touched.psf_file}
                              errorMessage={
                                errors.psf_file ? errors.psf_file : ''
                              }
                              fileType='CHARMM-GUI *.psf'
                              fileExt='.psf'
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {values.bilbomd_mode === 'pdb' && (
                      <>
                        <Grid
                          container
                          direction='row'
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '520px'
                          }}
                        >
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
                              errorMessage={
                                errors.pdb_file ? errors.pdb_file : ''
                              }
                              fileType=' *.pdb'
                              fileExt='.pdb'
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <Grid
                      container
                      direction='row'
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '520px'
                      }}
                    >
                      <Grid>
                        <Field
                          name='constinp'
                          id='constinp-file-upload'
                          as={FileSelect}
                          title='Select File'
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          onBlur={handleBlur}
                          error={errors.constinp && touched.constinp}
                          errorMessage={errors.constinp ? errors.constinp : ''}
                          fileType='const.inp'
                          fileExt='.inp'
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      direction='row'
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '520px'
                      }}
                    >
                      <Alert severity='info'>
                        <Typography component='div'>
                          Be sure to verify that the chain identifiers (
                          <b>segid</b>) and residue numbering in your{' '}
                          <b>const.inp</b> are consistent with your{' '}
                          <b>
                            {values.bilbomd_mode === 'pdb' ? `*.pdb` : `*.crd`}
                          </b>{' '}
                          file.
                          {values.bilbomd_mode === 'pdb' ? (
                            <>
                              {' '}
                              For example, Protein Chain ID <b>A</b> will be
                              converted to segid <b>PROA</b> and DNA Chain ID{' '}
                              <b>G</b> will be converted to segid <b>DNAG</b>.
                            </>
                          ) : (
                            <>
                              {' '}
                              Keeping in mind that CHARMM-GUI creates segid
                              names in a unique way.
                            </>
                          )}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid
                      container
                      direction='row'
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '520px'
                      }}
                    >
                      <Grid>
                        <Field
                          name='expdata'
                          id='expdata-file-upload'
                          as={FileSelect}
                          title='Select File'
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.expdata && touched.expdata}
                          errorMessage={errors.expdata ? errors.expdata : ''}
                          fileType='experimental SAXS data'
                          fileExt='.dat'
                          onFileChange={async (selectedFile: File) => {
                            const isExpdataValid =
                              await expdataSchema.isValid(selectedFile)
                            if (isExpdataValid) {
                              const formData = new FormData()
                              formData.append('email', email)
                              formData.append('expdata', selectedFile)
                              try {
                                const { rg, rg_min, rg_max } =
                                  await calculateAutoRg(formData).unwrap()
                                setFieldValue('rg', rg)
                                setFieldValue('rg_min', rg_min)
                                setFieldValue('rg_max', rg_max)
                              } catch (error) {
                                console.error('Error:', error)
                                setFieldValue('rg_min', '')
                                setFieldValue('rg_max', '')
                              }
                            } else {
                              setFieldValue('rg_min', '')
                              setFieldValue('rg_max', '')
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid sx={{ display: 'flex', width: '520px' }}>
                      <Typography>
                        <b>Rg Min</b> and <b>Rg Max</b> will be calculated
                        automatically from the selected SAXS data file. Feel
                        free to change the suggested values.
                      </Typography>
                    </Grid>
                    {isLoading && (
                      <Box sx={{ my: 1, width: '520px' }}>
                        <LinearProgress />
                      </Box>
                    )}
                    <Grid sx={{ my: 2, display: 'flex', width: '520px' }}>
                      <Field
                        label='Rg Min'
                        fullWidth
                        id='rg_min'
                        name='rg_min'
                        type='text'
                        disabled={isSubmitting || isLoading}
                        as={TextField}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.rg_min && touched.rg_min}
                        helperText={
                          errors.rg_min && touched.rg_min
                            ? errors.rg_min
                            : 'Min value of Rg ...(between 10 and 100)'
                        }
                      />
                    </Grid>
                    <Grid sx={{ my: 2, display: 'flex', width: '520px' }}>
                      <Field
                        label='Rg Max'
                        fullWidth
                        id='rg_max'
                        name='rg_max'
                        type='text'
                        disabled={isSubmitting || isLoading}
                        as={TextField}
                        error={errors.rg_max && touched.rg_max}
                        helperText={
                          errors.rg_max && touched.rg_max
                            ? errors.rg_max
                            : 'Max value of Rg ...(between 10 and 100)'
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid sx={{ my: 2, display: 'flex', width: '520px' }}>
                      <TextField
                        label='Conformations per Rg'
                        variant='outlined'
                        id='num_conf'
                        name='num_conf'
                        select
                        defaultValue=''
                        sx={{ width: '520px' }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.num_conf && touched.num_conf)}
                        helperText={
                          errors.num_conf && touched.num_conf
                            ? errors.num_conf
                            : 'Number of conformations to sample per Rg'
                        }
                      >
                        <MenuItem key={1} value={1}>
                          200
                        </MenuItem>
                        <MenuItem key={2} value={2}>
                          400
                        </MenuItem>
                        <MenuItem key={3} value={3}>
                          600
                        </MenuItem>
                        <MenuItem key={4} value={4}>
                          800
                        </MenuItem>
                      </TextField>
                    </Grid>
                    {isSubmitting && (
                      <Box sx={{ width: '520px' }}>
                        <LinearProgress />
                      </Box>
                    )}
                    <Grid size={{ xs: 6 }} sx={{ my: 2 }}>
                      <Button
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
                      </Button>

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
  )

  return content
}

export default NewJobForm
