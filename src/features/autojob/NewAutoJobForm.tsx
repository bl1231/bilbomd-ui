import {
  Box,
  Grid,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Form, Formik, Field } from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewAutoJobMutation } from '../jobs/jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { BilboMDAutoJobSchema } from 'schemas/BilboMDAutoJobSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'

const NewAutoJobForm = () => {
  const [addNewAutoJob, { isSuccess }] = useAddNewAutoJobMutation()
  const { email } = useAuth()

  const initialValues = {
    title: '',
    pdb_file: '',
    pae_file: '',
    dat_file: '',
    email: email
  }

  const onSubmit = async (values, { setStatus }) => {
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
              <Box>
                <Typography sx={{ m: 1 }}>
                  <b>BilboMD Auto</b> is intended to be run using the outputs
                  from{' '}
                  <Link
                    href='https://deepmind.google/technologies/alphafold/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    AlphaFold2 & AlphaFold-Multimer
                  </Link>
                  . <b>BilboMD Auto</b> uses the{' '}
                  <Link
                    href='https://alphafold.ebi.ac.uk/faq#faq-13'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Predicted Aligned Error
                  </Link>{' '}
                  (PAE) from AlphaFold along with the predicted coordinates (as
                  a PDB file) to automagically generate CHARMM-compatible input
                  files. The <b>*.pdb</b> and PAE <b>*.json</b> files must be
                  the exact ones obtained from AlphaFold since we are also using
                  the{' '}
                  <Link
                    href='https://alphafold.ebi.ac.uk/faq#faq-12'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    pLDDT
                  </Link>{' '}
                  values stored in the B-factor column to guide the selection of
                  rigid and flexible regions.
                </Typography>
                <ul>
                  <li>
                    <Typography>
                      An AlphaFold PDB <b>*.pdb</b> file (PDB coordinate file.
                      Make sure it matches your PAE file.)
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      An AlphaFold PAE <b>*.json</b> file (The PAE matrix output
                      from AlphaFold in JSON format.)
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      A <b>*.dat</b> file (A 3-column experimental SAXS data
                      file)
                    </Typography>
                  </li>
                </ul>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <HeaderBox>
            <Typography>BilboMD Auto Job Form</Typography>
          </HeaderBox>
          {/* <Alert severity='warning'>
            <b>BilboMD Auto</b> does not yet work with the outputs from{' '}
            <b>AlphaFold3</b>
          </Alert> */}
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

                      <Grid item>
                        <Field
                          name='pdb_file'
                          id='crd-file-upload'
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

                      <Grid item>
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
                      <Grid item>
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
                      <Grid item sx={{ mt: 2 }}>
                        <LoadingButton
                          type='submit'
                          disabled={
                            !isValid ||
                            values.title === '' ||
                            values.pdb_file === '' ||
                            values.pae_file === '' ||
                            values.dat_file === ''
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
