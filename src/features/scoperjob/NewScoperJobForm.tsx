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
  AccordionDetails
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Form, Formik, Field } from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewScoperJobMutation } from '../jobs/jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { bilbomdScoperJobSchema } from 'schemas/ScoperValidationSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'

const NewScoperJobForm = () => {
  const [addNewScoperJob, { isSuccess }] = useAddNewScoperJobMutation()
  const { email } = useAuth()

  const initialValues = {
    title: '',
    pdb_file: '',
    dat_file: '',
    email: email
  }

  const onSubmit = async (values, { setStatus }) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('pdb_file', values.pdb_file)
    form.append('dat_file', values.dat_file)
    form.append('email', values.email)
    form.append('job_type', 'BilboMDScoper')

    try {
      const newJob = await addNewScoperJob(form).unwrap()
      // setJobid(newJob.jobid)
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
              <Typography sx={{ m: 1 }}>
                Scoper is a novel data analysis pipeline that uses a combination of
                classical algorithms and deep-learning techniques to find structures,
                along with magnesium ion binding sites that fit a given SAXS profile,
                given an initial structure to work with.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <img
                  src="/scoper/scoper_full_pipeline.png"
                  alt="Overview of Scoper pipeline"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
              <Typography sx={{ m: 1 }}>
                A novel deep neural network was created for this pipeline which we named
                IonNet. IonNet is used to predict magnesium binding sites for RNA
                structures. The input for our model is a PDB file of the RNA structure.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <img
                  src="/scoper/MGClassifier_Architecture.drawio.png"
                  alt="Overview of Scoper pipeline"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
              <Typography>
                Scoper was created by Edan Patt, Dina Schneidman, and Michal Hammel. The
                web implementation was done by Scott Classen. The source code and trained
                model for the backend Scoper/IonNet analysis steps comes from the{' '}
                <a
                  href="https://github.com/dina-lab3D/IonNet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IonNet
                </a>{' '}
                repository.{' '}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <HeaderBox>
            <Typography>Scoper Job Form</Typography>
          </HeaderBox>

          <Paper sx={{ p: 2 }}>
            {isSuccess ? (
              <Alert severity="success">
                <AlertTitle>Woot!</AlertTitle>
                <Typography>
                  Your Scoper job has been submitted. Check out the{' '}
                  <Link to="../jobs">details</Link>.
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
                    <Grid container direction="column">
                      <Grid item sx={{ my: 2, width: '520px' }}>
                        <Field
                          fullWidth
                          label="Title"
                          name="title"
                          id="title"
                          type="text"
                          disabled={isSubmitting}
                          as={TextField}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.title && touched.title}
                          helperText={errors.title && touched.title ? errors.title : ''}
                          value={values.title || ''}
                        />
                      </Grid>

                      <Grid item>
                        <Field
                          name="pdb_file"
                          id="pdb-file-upload"
                          as={FileSelect}
                          title="Select File"
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.pdb_file && values.pdb_file}
                          errorMessage={errors.pdb_file ? errors.pdb_file : ''}
                          fileType="RNA *.pdb"
                          fileExt=".pdb"
                        />
                      </Grid>

                      <Grid item>
                        <Field
                          name="dat_file"
                          id="dat-file-upload"
                          as={FileSelect}
                          title="Select File"
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.dat_file && values.dat_file}
                          errorMessage={errors.dat_file ? errors.dat_file : ''}
                          fileType="experimental SAXS data"
                          fileExt=".dat"
                        />
                      </Grid>

                      {isSubmitting && (
                        <Box sx={{ my: 1, width: '520px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      <Grid item sx={{ mt: 2 }}>
                        <LoadingButton
                          type="submit"
                          disabled={
                            !isValid ||
                            values.title === '' ||
                            values.pdb_file === '' ||
                            values.dat_file === ''
                          }
                          loading={isSubmitting}
                          endIcon={<SendIcon />}
                          loadingPosition="end"
                          variant="contained"
                          sx={{ width: '110px' }}
                        >
                          <span>Submit</span>
                        </LoadingButton>

                        {isSuccess ? <Alert severity="success">{status}</Alert> : ''}
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
