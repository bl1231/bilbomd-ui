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
import { useAddNewAutoJobMutation } from '../jobs/jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { bilbomdAutoJobSchema } from 'schemas/ValidationSchemas'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'

const NewAutoJobForm = () => {
  const [addNewAutoJob, { isSuccess }] = useAddNewAutoJobMutation()
  const { email } = useAuth()

  const initialValues = {
    title: '',
    crd_file: '',
    psf_file: '',
    pae_file: '',
    dat_file: '',
    email: email
  }

  const onSubmit = async (values, { setStatus }) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('psf_file', values.psf_file)
    form.append('crd_file', values.crd_file)
    form.append('dat_file', values.dat_file)
    form.append('pae_file', values.pae_file)
    form.append('email', values.email)

    try {
      const newJob = await addNewAutoJob(form).unwrap()
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
                <b>BilboMD</b> uses <a href="https://academiccharmm.org/">CHARMM</a> to
                generate an ensemble of molecular models. In order for the Molecular
                Dynamics steps to run successfully it is imperative that you provide
                compatible input files.
                <li>
                  <b>*.crd</b> file (A CHARMM coordinate file)
                </li>
                <li>
                  <b>*.psf</b> file (A CHARMM{' '}
                  <a href="https://academiccharmm.org/documentation/version/c47b2/struct">
                    data structure
                  </a>{' '}
                  file)
                </li>
                <li>
                  <b>*.dat</b> file (A 3-column SAXS data file)
                </li>
                <li>
                  <b>pae.json</b> file (PAE output from Alphafold)
                </li>
              </Typography>
              <Typography sx={{ m: 1 }}>
                Use the <b>PDB Reader</b> tool available from{' '}
                <a href="https://www.charmm-gui.org/">CHARMM-GUI</a> to convert your
                standard PDB file to a CRD file. If you need help generating a valid{' '}
                <b>const.inp</b> file you can use our little Jiffy (green button below or
                &ldquo;Jiffy&rdquo; links to the left) to help get you started.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <HeaderBox>
            <Typography>BilboMD Auto Job Form</Typography>
          </HeaderBox>

          <Paper sx={{ p: 2 }}>
            {isSuccess ? (
              <Alert severity="success">
                <AlertTitle>Woot!</AlertTitle>
                <Typography>
                  Your job has been submitted. Check out the{' '}
                  <Link to="../jobs">details</Link>.
                </Typography>
              </Alert>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={bilbomdAutoJobSchema}
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
                          name="crd_file"
                          id="crd-file-upload"
                          as={FileSelect}
                          title="Select File"
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.crd_file && values.crd_file}
                          errorMessage={errors.crd_file ? errors.crd_file : ''}
                          fileType="CHARMM-GUI *.crd"
                          fileExt=".crd"
                        />
                      </Grid>

                      <Grid item>
                        <Field
                          name="psf_file"
                          id="psf-file-upload"
                          as={FileSelect}
                          title="Select File"
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.psf_file && values.psf_file}
                          errorMessage={errors.psf_file ? errors.psf_file : ''}
                          fileType="CHARMM-GUI *.psf"
                          fileExt=".psf"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          name="pae_file"
                          id="pae-file-upload"
                          as={FileSelect}
                          title="Select File"
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.pae_file && values.pae_file}
                          errorMessage={errors.pae_file ? errors.pae_file : ''}
                          fileType="Alphafold PAE *.json"
                          fileExt=".json"
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
                            values.crd_file === '' ||
                            values.psf_file === '' ||
                            values.pae_file === '' ||
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

export default NewAutoJobForm
