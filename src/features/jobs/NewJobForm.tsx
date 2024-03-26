// import { useState } from 'react'
import {
  Box,
  Checkbox,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  FormGroup,
  FormControlLabel,
  Divider
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Form, Formik, Field } from 'formik'
import FileSelect from './FileSelect'
import { useAddNewJobMutation } from './jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { expdataSchema } from 'schemas/ValidationSchemas'
import { BilboMDClassicJobSchema } from 'schemas/BilboMDClassicJobSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import { axiosInstance } from 'app/api/axios'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import { useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'

const NewJobForm = () => {
  const token = useSelector(selectCurrentToken)
  const [addNewJob, { isSuccess }] = useAddNewJobMutation()
  const { email } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const initialValues = {
    bilbomd_mode: 'pdb',
    title: '',
    psf_file: '',
    crd_file: '',
    pdb_file: '',
    constinp: '',
    expdata: '',
    num_conf: '',
    rg_min: '',
    rg_max: '',
    email: email
  }

  const onSubmit = async (values, { setStatus }) => {
    const form = new FormData()
    form.append('bilbomd_mode', values.bilbomd_mode)
    form.append('title', values.title)
    form.append('psf_file', values.psf_file)
    form.append('crd_file', values.crd_file)
    form.append('pdb_file', values.pdb_file)
    form.append('num_conf', values.num_conf)
    form.append('rg_min', values.rg_min)
    form.append('rg_max', values.rg_max)
    form.append('expdata', values.expdata)
    form.append('constinp', values.constinp)
    form.append('email', values.email)
    form.append('job_type', 'BilboMD')

    try {
      const newJob = await addNewJob(form).unwrap()
      // setJobid(newJob.jobid)
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const calculateAutoRg = (selectedFile, setFieldValue) => {
    setIsLoading(true)
    const form = new FormData()
    form.append('email', email)
    form.append('expdata', selectedFile)
    axiosInstance
      .post('/autorg', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const { rg_min, rg_max } = response.data
        setFieldValue('rg_min', rg_min)
        setFieldValue('rg_max', rg_max)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleCheckboxChange =
    (
      setFieldValue: (
        field: string,
        value: string,
        shouldValidate?: boolean
      ) => void
    ) =>
    (
      event: React.ChangeEvent<HTMLInputElement>
      // checked: boolean // Include this parameter to match the expected signature
    ) => {
      const newBilboMDMode =
        event.target.name === 'pdb_inputs' ? 'pdb' : 'crd_psf'
      setFieldValue('bilbomd_mode', newBilboMDMode)
      // reset other value to empty
      if (newBilboMDMode === 'pdb') {
        setFieldValue('psf_file', '')
        setFieldValue('crd_file', '')
      } else {
        setFieldValue('pdb_file', '')
      }
    }

  const content = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{
                backgroundColor: '#888',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                pl: 1
              }}
            >
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  letterSpacing: '1px'
                }}
              >
                Instructions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ mx: 1, my: 2 }}>
                <b>BilboMD Classic</b> uses{' '}
                <Link
                  href='https://academiccharmm.org/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  CHARMM
                </Link>{' '}
                to generate an ensemble of molecular models. In order for the
                Molecular Dynamics steps to run successfully it is imperative
                that you provide compatible input files.
                <br />
              </Typography>
              <Typography sx={{ mx: 1, my: 2 }}>
                Use <b>BilboMD Classic</b> if you want more control over the
                inputs. For example, if you have DNA, RNA, or other ligands and
                pot-translational modifications then you should use{' '}
                <Link
                  href='https://www.charmm-gui.org/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  CHARMM-GUI
                </Link>{' '}
                to paramaterize your input model. If you have generated your own{' '}
                <b>const.inp</b> file, either manually or via one of our Jiffys,
                then you may want to use <b>BilboMD Classic</b>. <br />
              </Typography>
              <Typography sx={{ mx: 1, my: 2 }}>
                These are the required input files:
                <li>
                  <b>*.crd</b> file (A CHARMM coordinate file)
                </li>
                <li>
                  <b>*.psf</b> file (A CHARMM{' '}
                  <Link
                    href='https://academiccharmm.org/documentation/version/c47b2/struct'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    data structure
                  </Link>{' '}
                  file)
                </li>
                <li>
                  <b>*.inp</b> file (defining the rigid domains of your protein.
                  Typically named <b>const.inp</b> )
                </li>
                <li>
                  <b>*.dat</b> file (A 3-column SAXS data file)
                </li>
              </Typography>
              <Typography sx={{ mx: 1, my: 2 }}>
                Use the <b>PDB Reader</b> tool available from{' '}
                <Link
                  href='https://www.charmm-gui.org/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  CHARMM-GUI
                </Link>{' '}
                to convert your standard PDB file to a CRD file. If you need
                help generating a valid <b>const.inp</b> file you can use our
                little Jiffy (green button below or &ldquo;Jiffy&rdquo; links to
                the left) to help get you started.
              </Typography>
              <Typography sx={{ mx: 1, my: 2 }}>
                <b>Conformations per Rg</b> - Specify the number of atomic
                models to be calculated for each Rg Step (Radius of Gyration -
                explanation below). More models will increase the conformational
                space sampled at the expense of slightly longer computational
                times.
              </Typography>
              <Typography sx={{ mx: 1, my: 2 }}>
                <b>Rg Steps</b> - Define the Radius of Gyration range (as{' '}
                <b>Rg Min</b>
                and <b>Rg Max</b>) that will constrain the MD simulations.{' '}
                <b>BilboMD</b> will calculate 5 equidistant steps bewteen{' '}
                <b>Rg Min</b> and <b>Rg Max</b> to perform Molecular Dynamics. A
                good rule-of-thumb for your initial <b>BilboMD Classic</b> run
                is to select initial <b>Rg Min</b> and <b>Rg Max</b> values from
                -7% to +25% around your experimental Rg respectively. If your
                experimental Rg is 25-30 &#8491;, the MD simulations can behave
                eradically if you specify an <b>Rg Min</b> that is too small.
                This is why we recommend <b>Rg Min</b> to be ~ 7% less than your
                experimental Rg. However, if your experimental Rg is larger
                (e.g. &gt;50 &#8491;) then you can probably explore a wider
                range and pick <b>Rg Min</b> and <b>Rg Max</b> values that are
                +/- 25%.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <HeaderBox>
            <Typography>BilboMD Job Form</Typography>
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
                  setFieldTouched
                }) => (
                  <Form>
                    <Grid
                      container
                      columns={12}
                      direction='column'
                      sx={{ display: 'flex' }}
                    >
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
                        <Grid item xs={6}>
                          <FormGroup sx={{ ml: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.bilbomd_mode === 'pdb'}
                                  onChange={handleCheckboxChange(setFieldValue)}
                                  name='pdb_inputs'
                                />
                              }
                              label='PDB file'
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.bilbomd_mode === 'crd_psf'}
                                  onChange={handleCheckboxChange(setFieldValue)}
                                  name='crd_psf_inputs'
                                />
                              }
                              label='CRD/PSF files'
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={6}>
                          <Alert severity='info'>
                            If you used CHARMM-GUI to parameterize your inputs
                            then please select the CRD/PSF option
                          </Alert>
                        </Grid>
                      </Grid>
                      <Divider textAlign='left' sx={{ my: 1 }}>
                        Job Form
                      </Divider>
                      <Grid item sx={{ my: 2, width: '520px' }}>
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
                            <Grid item>
                              <Field
                                name='crd_file'
                                id='crd-file-upload'
                                as={FileSelect}
                                title='Select File'
                                disabled={isSubmitting}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                error={errors.crd_file && values.crd_file}
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
                            <Grid item>
                              <Field
                                name='psf_file'
                                id='psf-file-upload'
                                as={FileSelect}
                                title='Select File'
                                disabled={isSubmitting}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                error={errors.psf_file && values.psf_file}
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
                            <Grid item>
                              <Field
                                name='pdb_file'
                                id='pdb-file-upload'
                                as={FileSelect}
                                title='Select File'
                                disabled={isSubmitting}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                error={errors.pdb_file && values.pdb_file}
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
                        <Grid item>
                          <Field
                            name='constinp'
                            id='constinp-file-upload'
                            as={FileSelect}
                            title='Select File'
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.constinp && values.constinp}
                            errorMessage={
                              errors.constinp ? errors.constinp : ''
                            }
                            helperText='Select a const.inp file to upload'
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
                        <Grid item>
                          <Field
                            name='expdata'
                            id='expdata-file-upload'
                            as={FileSelect}
                            title='Select File'
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.expdata && values.expdata}
                            errorMessage={errors.expdata ? errors.expdata : ''}
                            helperText='Select a const.inp file to upload'
                            fileType='experimental SAXS data'
                            fileExt='.dat'
                            onFileChange={async (selectedFile) => {
                              const isExpdataValid =
                                await expdataSchema.isValid(selectedFile)
                              if (isExpdataValid) {
                                calculateAutoRg(selectedFile, setFieldValue)
                              } else {
                                setFieldValue('rg_min', '')
                                setFieldValue('rg_max', '')
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item sx={{ display: 'flex', width: '520px' }}>
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
                      <Grid
                        item
                        sx={{ my: 2, display: 'flex', width: '520px' }}
                      >
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
                      <Grid
                        item
                        sx={{ my: 2, display: 'flex', width: '520px' }}
                      >
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
                      <Grid
                        item
                        sx={{ my: 2, display: 'flex', width: '520px' }}
                      >
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
                      <Grid item xs={6} sx={{ my: 2 }}>
                        <LoadingButton
                          type='submit'
                          disabled={
                            !isValid ||
                            values.title === '' ||
                            values.constinp === '' ||
                            values.expdata === '' ||
                            values.rg_max === '' ||
                            values.rg_min === '' ||
                            values.num_conf === '' ||
                            (values.bilbomd_mode === 'pdb' &&
                              values.pdb_file === '') ||
                            (values.bilbomd_mode === 'crd_psf' &&
                              (values.psf_file === '' ||
                                values.crd_file === ''))
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

export default NewJobForm
