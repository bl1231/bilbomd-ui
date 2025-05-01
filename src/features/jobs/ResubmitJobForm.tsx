import { useState, useEffect } from 'react'
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
import { Link as RouterLink, useParams } from 'react-router'
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
  useCalculateAutoRgMutation,
  useGetJobByIdQuery,
  useCheckJobFilesQuery
} from 'slices/jobsApiSlice'
import SendIcon from '@mui/icons-material/Send'
import { expdataSchema } from 'schemas/ExpdataSchema'
import { BilboMDClassicJobSchema } from 'schemas/BilboMDClassicJobSchema'
import HeaderBox from 'components/HeaderBox'
import useTitle from 'hooks/useTitle'
import NerscStatusChecker from 'features/nersc/NerscStatusChecker'
import FileSelect from './FileSelect'
import { Debug } from 'components/Debug'
import NewJobFormInstructions from './NewJobFormInstructions'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { useTheme } from '@mui/material/styles'
import PipelineSchematic from './PipelineSchematic'
import { BilboMDClassicJobFormValues } from '../../types/classicJobForm'

const ResubmitJobForm = () => {
  useTitle('BilboMD: Resubmit Classic Job')
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [addNewJob, { isSuccess }] = useAddNewJobMutation()
  const [calculateAutoRg, { isLoading }] = useCalculateAutoRgMutation()
  const { id } = useParams()
  const [isPerlmutterUnavailable, setIsPerlmutterUnavailable] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'pdb' | 'crd_psf'>('pdb')

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
    setIsPerlmutterUnavailable(isUnavailable)
  }

  const {
    data: jobdata,
    isLoading: jobIsLoading,
    isError: jobIsError
  } = useGetJobByIdQuery(id, {})
  if (jobIsLoading) return <LinearProgress />
  if (jobIsError)
    return <Alert severity='error'>Error retrieving parent job info</Alert>
  const job = jobdata?.mongo

  const { data: fileCheckData, error: fileCheckError } = useCheckJobFilesQuery(
    jobdata?.id ?? '',
    {
      skip: !jobdata?.id // avoids running until ID is available
    }
  )

  if (fileCheckError) {
    return (
      <Alert severity='error'>
        Error checking job files:{' '}
        {'message' in fileCheckError ? fileCheckError.message : 'Unknown error'}
      </Alert>
    )
  }

  useEffect(() => {
    if (!job) return
    const derivedMode = job.__t === 'BilboMdCRD' ? 'crd_psf' : 'pdb'
    setSelectedMode(derivedMode)
  }, [job])

  // console.log('job', job)

  const initialValues: BilboMDClassicJobFormValues = job
    ? {
        bilbomd_mode: selectedMode,
        title: 'resubmit_' + job.title,
        psf_file: job.psf_file ?? '',
        crd_file: job.crd_file ?? '',
        pdb_file: job.pdb_file ?? '',
        inp_file: job.const_inp_file ?? '',
        dat_file: job.data_file ?? '',
        num_conf: job.conformational_sampling?.toString() ?? '',
        rg: job.rg?.toString() ?? '',
        rg_min: job.rg_min?.toString() ?? '',
        rg_max: job.rg_max?.toString() ?? ''
      }
    : {
        bilbomd_mode: 'pdb',
        title: '',
        psf_file: '',
        crd_file: '',
        pdb_file: '',
        inp_file: '',
        dat_file: '',
        num_conf: '',
        rg: '',
        rg_min: '',
        rg_max: ''
      }

  const onSubmit = async (
    values: BilboMDClassicJobFormValues,
    { setStatus }: { setStatus: (status: string) => void }
  ) => {
    const form = new FormData()
    form.append('bilbomd_mode', values.bilbomd_mode)
    form.append('title', values.title)
    form.append('resubmit', 'true')
    if (job?.id) {
      form.append('original_job_id', job.id)
    }

    if (values.psf_file instanceof File) {
      form.append('psf_file', values.psf_file)
    } else if (fileCheckData?.psf_file) {
      form.append('reuse_psf_file', 'true')
    }
    if (values.crd_file instanceof File) {
      form.append('crd_file', values.crd_file)
    } else if (fileCheckData?.crd_file) {
      form.append('reuse_crd_file', 'true')
    }
    if (values.pdb_file instanceof File) {
      form.append('pdb_file', values.pdb_file)
    } else if (fileCheckData?.pdb_file) {
      form.append('reuse_pdb_file', 'true')
    }

    form.append('num_conf', values.num_conf.toString())
    form.append('rg', values.rg)
    form.append('rg_min', values.rg_min)
    form.append('rg_max', values.rg_max)

    if (values.dat_file instanceof File) {
      form.append('dat_file', values.dat_file)
    } else if (fileCheckData?.dat_file) {
      form.append('reuse_dat_file', 'true')
    }

    if (values.inp_file instanceof File) {
      form.append('inp_file', values.inp_file)
    } else if (fileCheckData?.inp_file) {
      form.append('reuse_inp_file', 'true')
    }

    try {
      const newJob = await addNewJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const setMode = (
    mode: 'pdb' | 'crd_psf',
    resetForm: FormikHelpers<typeof initialValues>['resetForm'],
    values: typeof initialValues,
    touched: FormikTouched<typeof initialValues>,
    validateForm: (
      values?: Partial<typeof initialValues>
    ) => Promise<FormikErrors<typeof initialValues>>
  ) => {
    setSelectedMode(mode)

    if (mode === 'pdb') {
      resetForm({
        values: { ...values, crd_file: '', psf_file: '', bilbomd_mode: 'pdb' },
        errors: {},
        touched: { ...touched }
      })
    } else {
      resetForm({
        values: { ...values, pdb_file: '', bilbomd_mode: 'crd_psf' },
        errors: {},
        touched: { ...touched }
      })
    }

    setTimeout(() => validateForm(), 0)
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

      setMode(newBilboMDMode, resetForm, values, touched, validateForm)
    }

  const isFormValid = (
    values: BilboMDClassicJobFormValues,
    reuseFlags: typeof fileCheckData
  ) => {
    const hasPDB = values.pdb_file instanceof File || reuseFlags?.pdb_file
    const hasPSF = values.psf_file instanceof File || reuseFlags?.psf_file
    const hasCRD = values.crd_file instanceof File || reuseFlags?.crd_file
    const hasExpData = values.dat_file instanceof File || reuseFlags?.dat_file
    const hasConstInp = values.inp_file instanceof File || reuseFlags?.inp_file

    const hasTitle = values.title.trim() !== ''
    const hasRgFields =
      values.rg_min !== '' && values.rg_max !== '' && values.num_conf !== ''
    const modeReady = values.bilbomd_mode === 'pdb' ? hasPDB : hasPSF && hasCRD

    return (
      !isPerlmutterUnavailable &&
      hasTitle &&
      hasConstInp &&
      hasExpData &&
      hasRgFields &&
      modeReady
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
          <Typography>Resubmit - BilboMD Classic Job</Typography>
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
            <>
              <Alert severity='warning'>
                Make adjustments to run parameters or input files before
                resubmitting your job.
              </Alert>
              <Formik<BilboMDClassicJobFormValues>
                initialValues={initialValues}
                enableReinitialize={true}
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
                                existingFileName={
                                  fileCheckData?.crd_file
                                    ? job?.crd_file
                                    : undefined
                                }
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
                                existingFileName={
                                  fileCheckData?.psf_file
                                    ? job?.psf_file
                                    : undefined
                                }
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
                                existingFileName={
                                  fileCheckData?.pdb_file
                                    ? job?.pdb_file
                                    : undefined
                                }
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
                            name='inp_file'
                            id='inp_file-file-upload'
                            as={FileSelect}
                            title='Select File'
                            existingFileName={
                              fileCheckData?.inp_file
                                ? job?.const_inp_file
                                : undefined
                            }
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            onBlur={handleBlur}
                            error={errors.inp_file && touched.inp_file}
                            errorMessage={
                              errors.inp_file ? errors.inp_file : ''
                            }
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
                              {values.bilbomd_mode === 'pdb'
                                ? `*.pdb`
                                : `*.crd`}
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
                            name='dat_file'
                            id='dat_file-file-upload'
                            as={FileSelect}
                            title='Select File'
                            existingFileName={
                              fileCheckData?.dat_file
                                ? job?.data_file
                                : undefined
                            }
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.dat_file && touched.dat_file}
                            errorMessage={
                              errors.dat_file ? errors.dat_file : ''
                            }
                            fileType='experimental SAXS data'
                            fileExt='.dat'
                            onFileChange={async (selectedFile: File) => {
                              const isExpdataValid =
                                await expdataSchema.isValid(selectedFile)
                              if (isExpdataValid) {
                                const formData = new FormData()
                                formData.append('dat_file', selectedFile)
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
                          value={values.num_conf}
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
                            !isFormValid(values, fileCheckData) || !isValid
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
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  )

  return content
}

export default ResubmitJobForm
