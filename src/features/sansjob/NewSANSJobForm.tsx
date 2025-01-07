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
import Grid from '@mui/material/Grid2'
import { Link as RouterLink } from 'react-router'
import { Form, Formik, Field } from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewSANSJobMutation } from 'slices/jobsApiSlice'
import { useCalculateAutoRgMutation } from 'slices/jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { BilboMDSANSJobSchema } from 'schemas/BilboMDSANSJobSchema'
import { expdataSchema } from 'schemas/ExpdataSchema'
import { pdbFileSchema } from 'schemas/PDBFileSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import useTitle from 'hooks/useTitle'
import { NewSANSJobFormValues } from '../../types/sansForm'
import NewSANSJobFormInstructions from './NewSANSJobFormInstructions'
import NerscStatusChecker from 'features/nersc/NerscStatusChecker'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import ChainDeuterationSlider from './ChainDeuterationSlider'
import { useTheme } from '@mui/material/styles'

const PipelineSchematic = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Grid size={{ xs: 12 }}>
    <HeaderBox>
      <Typography>BilboMD SANS Schematic</Typography>
    </HeaderBox>
    <Paper sx={{ p: 2 }}>
      <img
        src={
          isDarkMode
            ? '/images/bilbomd-sans-schematic-dark.png'
            : '/images/bilbomd-sans-schematic.png'
        }
        alt='Overview of BilboMD AF pipeline'
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Paper>
  </Grid>
)

const NewSANSJob = () => {
  useTitle('BilboMD: New SANS Job')
  const [addNewSANSJob, { isSuccess }] = useAddNewSANSJobMutation()
  const [calculateAutoRg, { isLoading }] = useCalculateAutoRgMutation()
  const { email } = useAuth()
  const [isPerlmutterUnavailable, setIsPerlmutterUnavailable] = useState(false)
  const [chainIds, setChainIds] = useState<string[]>([])

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

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
    bilbomd_mode: 'sans',
    email: email,
    title: '',
    pdb_file: '',
    dat_file: '',
    rg: 0,
    rg_min: 0,
    rg_max: 0,
    inp_file: '',
    d2o_fraction: 100
  }

  const onSubmit = async (
    values: NewSANSJobFormValues,
    { setStatus }: { setStatus: (status: string | null) => void }
  ) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('pdb_file', values.pdb_file)
    form.append('dat_file', values.dat_file)
    form.append('rg', values.rg.toString())
    form.append('rg_min', values.rg_min.toString())
    form.append('rg_max', values.rg_max.toString())
    form.append('inp_file', values.inp_file)
    form.append('d2o_fraction', values.d2o_fraction.toString())
    form.append('email', values.email)
    form.append('bilbomd_mode', 'sans')

    chainIds.forEach((chainId) => {
      const key =
        `deuteration_fraction_${chainId}` as keyof NewSANSJobFormValues
      if (key in values) {
        form.append(key, values[key].toString())
      }
    })

    try {
      const newJob = await addNewSANSJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const parsePDBFile = (fileContent: string): string[] => {
    const lines = fileContent.split('\n')
    const chainIdsSet: Set<string> = new Set()

    lines.forEach((line) => {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        const chainId = line.substring(21, 22).trim()
        if (chainId) {
          chainIdsSet.add(chainId)
        }
      }
    })

    return Array.from(chainIdsSet)
  }

  const isFormValid = (values: NewSANSJobFormValues) => {
    const hasValidDeuteration = chainIds.every(
      (chainId) =>
        values[`deuteration_fraction_${chainId}`] >= 0 &&
        values[`deuteration_fraction_${chainId}`] <= 100
    )

    return (
      !isPerlmutterUnavailable &&
      values.title !== '' &&
      values.pdb_file !== '' &&
      values.dat_file !== '' &&
      values.inp_file !== '' &&
      values.d2o_fraction >= 0 &&
      values.d2o_fraction <= 100 &&
      hasValidDeuteration
    )
  }

  const content = (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <NewSANSJobFormInstructions />
      </Grid>

      <PipelineSchematic isDarkMode={isDarkMode} />

      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Box display='flex' alignItems='center'>
            <Typography>BilboMD SANS Job Form</Typography>
            <Typography component='span' sx={{ color: 'yellow', ml: 1 }}>
              *Experimental - Please report problems to Scott
            </Typography>
          </Box>
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
                        onFileChange={async (selectedFile: File) => {
                          const isPDBValid =
                            await pdbFileSchema.isValid(selectedFile)
                          if (isPDBValid) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              const fileContent = e.target?.result as string
                              const parsedChainIds = parsePDBFile(fileContent)
                              setChainIds(parsedChainIds)
                            }
                            reader.readAsText(selectedFile)
                          } else {
                            setChainIds([])
                          }
                        }}
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
                    <Grid sx={{ display: 'flex', width: '520px' }}>
                      <Alert severity='info'>
                        <Typography>
                          <b>Rg Min</b> and <b>Rg Max</b> will be calculated
                          automatically from the selected SANS data file. Feel
                          free to change the suggested values.
                        </Typography>
                      </Alert>
                    </Grid>
                    {isLoading && (
                      <Box sx={{ my: 1, width: '520px' }}>
                        <LinearProgress />
                      </Box>
                    )}

                    {/* Rg Min */}
                    <Grid sx={{ my: 2, display: 'flex', width: '520px' }}>
                      <Field
                        label='Rg Min'
                        fullWidth
                        id='rg_min'
                        name='rg_min'
                        type='number'
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
                        inputProps={{ min: 10, max: 100 }}
                      />
                    </Grid>

                    {/* rRg Max */}
                    <Grid sx={{ my: 2, display: 'flex', width: '520px' }}>
                      <Field
                        label='Rg Max'
                        fullWidth
                        id='rg_max'
                        name='rg_max'
                        type='number'
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
                        inputProps={{ min: 0, max: 100 }}
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
                      <Typography id='d2o-fraction-slider' gutterBottom>
                        Solvent D<sub>2</sub>O Fraction
                      </Typography>
                      <Grid container spacing={2} alignItems='center'>
                        <Grid>
                          <Chip
                            label={`${values.d2o_fraction}%`}
                            variant='outlined'
                            color='success'
                            sx={{
                              width: 60, // Set a fixed width
                              justifyContent: 'center' // Center the label
                            }}
                          />
                        </Grid>
                        <Grid sx={{ flex: 1 }}>
                          <Slider
                            aria-labelledby='d2o-fraction-slider'
                            name='d2o_fraction'
                            value={values.d2o_fraction}
                            onChange={(_event, value) => {
                              setFieldValue('d2o_fraction', value)
                            }}
                            min={0}
                            max={100}
                            step={1}
                            valueLabelDisplay='off'
                            disabled={isSubmitting}
                            track={false}
                          />
                        </Grid>
                        {errors.d2o_fraction && touched.d2o_fraction ? (
                          <Typography color='error'>
                            {errors.d2o_fraction}
                          </Typography>
                        ) : null}
                      </Grid>
                    </Grid>

                    {/* Dynamic Deuteration Fraction Sliders */}
                    {chainIds.length > 0 && (
                      <div style={{ display: 'none' }}>
                        <ChainDeuterationSlider
                          chainIds={chainIds}
                          values={values}
                          errors={errors}
                          touched={touched}
                          isSubmitting={isSubmitting}
                          setFieldValue={setFieldValue}
                        />
                      </div>
                    )}

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
  )

  return content
}

export default NewSANSJob
