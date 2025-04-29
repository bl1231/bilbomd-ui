import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link as RouterLink } from 'react-router'
import { Form, Formik, Field, FormikHelpers } from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewScoperJobMutation } from 'slices/jobsApiSlice'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { bilbomdScoperJobSchema } from 'schemas/ScoperValidationSchema'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import useTitle from 'hooks/useTitle'

const NewScoperJobForm = () => {
  useTitle('New Scoper Job')
  const [addNewScoperJob, { isSuccess }] = useAddNewScoperJobMutation()

  const initialValues = {
    title: '',
    pdb_file: '',
    dat_file: '',
    fixc1c2: false
  }

  interface FormValues {
    title: string
    pdb_file: string
    dat_file: string
    fixc1c2: boolean
  }

  const onSubmit = async (
    values: FormValues,
    { setStatus }: FormikHelpers<FormValues>
  ) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('pdb_file', values.pdb_file)
    form.append('dat_file', values.dat_file)
    form.append('fixc1c2', values.fixc1c2.toString())
    form.append('bilbomd_mode', 'scoper')

    try {
      const newJob = await addNewScoperJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const content = (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
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
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: '#fff',
                  letterSpacing: '1px'
                }}
              >
                Instructions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ m: 1 }}>
                Scoper is a novel data analysis pipeline that uses a combination
                of classical algorithms and deep-learning techniques to find
                structures, along with magnesium ion binding sites that fit a
                given SAXS profile, given an initial structure to work with.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <img
                  src='/scoper/scoper_full_pipeline.png'
                  alt='Overview of Scoper pipeline'
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
              <Typography sx={{ m: 1 }}>
                A novel deep neural network was created for this pipeline which
                we named IonNet. IonNet is used to predict magnesium binding
                sites for RNA structures. The input for our model is a PDB file
                of the RNA structure.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <img
                  src='/scoper/MGClassifier_Architecture.drawio.png'
                  alt='Overview of Scoper pipeline'
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
              <Typography>
                Scoper was created by Edan Patt, Dina Schneidman, and Michal
                Hammel. The web implementation was done by Scott Classen. The
                source code and trained model for the backend Scoper/IonNet
                analysis steps comes from the{' '}
                <Link
                  href='https://github.com/dina-lab3D/IonNet'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  IonNet
                </Link>{' '}
                repository.{' '}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>Scoper Job Form</Typography>
          </HeaderBox>

          <Paper sx={{ p: 2 }}>
            {isSuccess ? (
              <Alert severity='success'>
                <AlertTitle>Woot!</AlertTitle>
                <Typography>
                  Your Scoper job has been submitted. Check out the{' '}
                  <RouterLink to='../jobs'>details</RouterLink>.
                </Typography>
              </Alert>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={bilbomdScoperJobSchema}
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
                          fileType='RNA *.pdb'
                          fileExt='.pdb'
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

                      <Grid>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mt: 2 }}
                        >
                          <Field name='fixc1c2'>
                            {({
                              field
                            }: {
                              field: {
                                name: string
                                value: boolean
                                onChange: (
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => void
                              }
                            }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                    name={field.name}
                                    disabled={isSubmitting}
                                    inputProps={{
                                      'aria-label': 'fix-c1c2-checkbox'
                                    }}
                                  />
                                }
                                label='Fix c1/c2 values at 1.00'
                              />
                            )}
                          </Field>
                        </Box>
                      </Grid>

                      <Grid sx={{ my: 2, width: '520px' }}>
                        <Alert
                          severity='info'
                          sx={{
                            fontSize: '1rem', // Adjust font size
                            lineHeight: '1.4' // Adjust line spacing
                          }}
                        >
                          SAXS profiles are calculated using the <b>FoXS</b>{' '}
                          calculator and fit to the experimental data by
                          adjusting the excluded volume (<b>c1</b>) and
                          hydration layer (<b>c2</b>) parameters (
                          <Link
                            href='https://doi.org/10.1016/j.bpj.2013.07.020'
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <b>details</b>
                          </Link>
                          ). The default is to let <b>FoXS</b> refine the{' '}
                          <b>c2</b> values. However, this can result in some Mg
                          <sup>++</sup> ions being &quot;absorbed&quot; into the
                          solvent contribution. To increase the likelihood of{' '}
                          <b>Scoper</b> placing Mg<sup>++</sup> ions in the RNA
                          structure, you can fix the <b>c1</b> and <b>c2</b>{' '}
                          values at <b>1.00</b>.
                        </Alert>
                      </Grid>

                      {isSubmitting && (
                        <Box sx={{ my: 1, width: '520px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      <Grid sx={{ mt: 2 }}>
                        <Button
                          type='submit'
                          disabled={
                            !isValid ||
                            values.title === '' ||
                            values.pdb_file === '' ||
                            values.dat_file === ''
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
    </>
  )

  return content
}

export default NewScoperJobForm
