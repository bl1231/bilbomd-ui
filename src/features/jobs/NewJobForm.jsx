import React, { useState } from 'react'
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  AlertTitle,
  Link,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { Form, Formik, Field } from 'formik'
import FileInput from './FileInput'
import { useAddNewJobMutation } from './jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { bilbomdJobSchema } from 'schemas/ValidationSchemas'
import useAuth from 'hooks/useAuth'
import { styled } from '@mui/material/styles'
import { Debug } from 'components/Debug'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px'
}

const initialValues = {
  title: '',
  psf_file: '',
  crd_file: '',
  constinp: '',
  expdata: '',
  num_conf: '',
  rg_min: '',
  rg_max: '',
  email: ''
}

const NewJobForm = () => {
  const [addNewJob, { isLoading, isSuccess, isError, error }] = useAddNewJobMutation()
  const { email } = useAuth()
  const [jobid, setJobid] = useState('')

  const onSubmit = async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('psf_file', values.psf_file)
    form.append('crd_file', values.crd_file)
    form.append('num_conf', values.num_conf)
    form.append('rg_min', values.rg_min)
    form.append('rg_max', values.rg_max)
    form.append('expdata', values.expdata)
    form.append('constinp', values.constinp)
    form.append('email', email)
    // Display the values
    // for (const value of form.values()) {
    //   console.log(value)
    // }

    try {
      const newJob = await addNewJob(form).unwrap()
      setJobid(newJob.jobid)
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const content = (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <Typography sx={HeaderThingee}>Instructions</Typography> */}
          {/* <Item> */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                backgroundColor: '#888',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                ml: 0,
                pl: 1,
                mx: 0
              }}
            >
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  letterSpacing: '1px',
                  m: 0
                }}
              >
                Instructions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ m: 1 }}>
                <b>BilboMD</b> uses <a href="https://academiccharmm.org/">CHARMM</a> to
                generate an ensemble of molecular models. In order for the Molecular
                Dynamics steps to run successfully it is imperative that you provide input
                files that are fully compatible.
                <li>
                  <b>*.crd</b> file (CHARMM compatible coordinate file derived from your
                  PDB file)
                </li>
                <li>
                  <b>*.psf</b> file (the central{' '}
                  <a href="https://academiccharmm.org/documentation/version/c47b2/struct">
                    data structure
                  </a>{' '}
                  in CHARMM)
                </li>
                <li>
                  <b>*.inp</b> file (defining the rigid domains of your protein. Typically
                  named <b>const.inp</b> )
                </li>
                <li>
                  <b>*.dat</b> file (SAXS data containing 3 columns)
                </li>
              </Typography>
              <Typography sx={{ m: 1 }}>
                You will need to use the <b>PDB Reader</b> tool available from{' '}
                <a href="https://www.charmm-gui.org/">CHARMM-GUI</a> to convert your PDB
                file to a CRD file. If you need help generating a valid <b>const.inp</b>{' '}
                file you can use out little Jiffy (green button below) to help get you
                started.
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* </Item> */}
        </Grid>

        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>New BilboMD Job Form</Typography>
          <Item>
            {isSuccess ? (
              <Alert severity="success">
                <AlertTitle>Woot!</AlertTitle>Your job has been submitted. Check out the{' '}
                <Link href={'/dashboard/jobs/' + jobid}>details</Link>.
              </Alert>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={bilbomdJobSchema}
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
                  resetForm,
                  status,
                  setFieldValue,
                  setFieldTouched
                }) => (
                  <Form>
                    <Grid
                      container
                      columns={12}
                      direction="column"
                      sx={{ display: 'flex' }}
                    >
                      <Grid item sx={{ my: 2, display: 'flex', width: '520px' }}>
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

                      <Grid
                        container
                        direction="row"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '520px'
                        }}
                      >
                        <Grid item sx={{ my: 1, display: 'flex' }}>
                          <Field
                            name="psf_file"
                            id="psf-file-upload"
                            as={FileInput}
                            title="Select File"
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.psf_file && touched.psf_file}
                            errorMessage={errors.psf_file ? errors.psf_file : ''}
                            helperText="Select a PSF file to upload"
                            fileType="*.PSF"
                            fileExt=".psf"
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        direction="row"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '520px'
                        }}
                      >
                        <Grid item sx={{ my: 1, display: 'flex' }}>
                          <Field
                            name="crd_file"
                            id="crd-file-upload"
                            as={FileInput}
                            title="Select File"
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.crd_file && touched.crd_file}
                            errorMessage={errors.crd_file ? errors.crd_file : ''}
                            helperText="Select a CRD file to upload"
                            fileType="*.CRD"
                            fileExt=".crd"
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        direction="row"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '520px'
                        }}
                      >
                        <Grid item sx={{ my: 1, display: 'flex' }}>
                          <Field
                            name="constinp"
                            id="constinp-file-upload"
                            as={FileInput}
                            title="Select File"
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.constinp && touched.constinp}
                            errorMessage={errors.constinp ? errors.constinp : ''}
                            helperText="Select a const.inp file to upload"
                            fileType="const.inp"
                            fileExt=".inp"
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{ my: 1, display: 'flex', alignItems: 'flex-end' }}
                        >
                          <Paper variant="outlined">
                            <Typography sx={{ m: 1 }}>
                              <b>*.inp</b> Jiffy:
                              <Button
                                href="constinp"
                                variant="contained"
                                sx={{
                                  color: '#003eb3',
                                  backgroundColor: '#95de64',
                                  '&:hover': {
                                    backgroundColor: '#73d13d',
                                    color: '#003eb3'
                                  },
                                  ml: 3
                                }}
                                startIcon={<AutoFixHighIcon />}
                              >
                                Create a const.inp file
                              </Button>
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        direction="row"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '520px'
                        }}
                      >
                        <Grid item sx={{ my: 1, display: 'flex' }}>
                          <Field
                            name="expdata"
                            id="expdata-file-upload"
                            as={FileInput}
                            title="Select File"
                            disabled={isSubmitting}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.expdata && touched.expdata}
                            errorMessage={errors.expdata ? errors.expdata : ''}
                            helperText="Select a const.inp file to upload"
                            fileType="experimental SAXS data"
                            fileExt=".dat"
                          />
                        </Grid>
                      </Grid>

                      <Grid item sx={{ my: 2, display: 'flex', width: '520px' }}>
                        <TextField
                          label="Conformations per Rg"
                          variant="outlined"
                          id="num_conf"
                          name="num_conf"
                          select
                          defaultValue=""
                          sx={{ width: '520px' }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.num_conf && touched.num_conf}
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

                      <Grid item sx={{ my: 2, display: 'flex', width: '520px' }}>
                        <Field
                          label="Rg Min"
                          fullWidth
                          id="rg_min"
                          name="rg_min"
                          type="text"
                          disabled={isSubmitting}
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

                      <Grid item sx={{ my: 2, display: 'flex', width: '520px' }}>
                        <Field
                          label="Rg Max"
                          fullWidth
                          id="rg_max"
                          name="rg_max"
                          type="text"
                          disabled={isSubmitting}
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

                      <Grid item xs={6} sx={{ my: 2 }}>
                        <LoadingButton
                          type="submit"
                          disabled={!isValid}
                          loading={isSubmitting}
                          endIcon={<SendIcon />}
                          loadingPosition="end"
                          variant="contained"
                          size="large"
                        >
                          <span>Submit</span>
                        </LoadingButton>
                        {isSuccess ? <Alert severity="success">{status}</Alert> : ''}
                      </Grid>
                    </Grid>
                    {/* <Debug /> */}
                  </Form>
                )}
              </Formik>
            )}
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )

  return content
}

export default NewJobForm
