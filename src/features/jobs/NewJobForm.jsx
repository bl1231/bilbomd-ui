import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  AlertTitle,
  Link
} from '@mui/material'
import FileInput from './FileInput'
import { useAddNewJobMutation } from './jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { Form, Formik, Field } from 'formik'
import { bilbomdJobSchema } from 'schemas/ValidationSchemas'
//import { useNavigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'
import React, { useState } from 'react'
import { Debug } from 'components/Debug'

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
  const [psfFileName, setPsfFileName] = useState('')
  const [crdFileName, setCrdFileName] = useState('')
  const [expdataFileName, setExpdataFileName] = useState('')
  const [constinpFileName, setConstinpFileName] = useState('')
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
      // console.log(newJob)
      // console.log(newJob.message)
      // console.log(newJob.jobid)
      setJobid(newJob.jobid)
      setStatus(newJob)
      setPsfFileName('')
      setCrdFileName('')
      setExpdataFileName('')
      setConstinpFileName('')
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const content = (
    <Card>
      <CardContent>
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
              setFieldValue
            }) => (
              <Form>
                <Grid container columns={12} direction="column" sx={{ display: 'flex' }}>
                  <Typography variant="h3">New BilboMD Job Form</Typography>
                  <Grid item sx={{ my: 2, display: 'flex', width: '440px' }}>
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
                      width: '440px'
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
                        errorMessage={errors.psf_file ? errors.psf_file : ''}
                        // touched={touched.psf_file}
                        // onChange={handleChange}
                        onBlur={handleBlur}
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
                      width: '440px'
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
                        errorMessage={errors.crd_file ? errors.crd_file : ''}
                        // touched={touched.crd_file}
                        // onChange={handleChange}
                        onBlur={handleBlur}
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
                      width: '440px'
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
                        errorMessage={errors.constinp ? errors.constinp : ''}
                        // touched={touched.constinp}
                        // onChange={handleChange}
                        onBlur={handleBlur}
                        helperText="Select a const.inp file to upload"
                        fileType="const.inp"
                        fileExt=".inp"
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    direction="row"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '440px'
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
                        error={errors.expdata && touched.expdata}
                        errorMessage={errors.expdata ? errors.expdata : ''}
                        // touched={touched.expdata}
                        // onChange={handleChange}
                        onBlur={handleBlur}
                        helperText="Select a const.inp file to upload"
                        fileType="experimental SAXS data"
                        fileExt=".dat"
                      />
                    </Grid>
                  </Grid>

                  <Grid item sx={{ my: 2, display: 'flex', width: '440px' }}>
                    <TextField
                      label="Conformations per Rg"
                      variant="outlined"
                      id="num_conf"
                      name="num_conf"
                      select
                      defaultValue=""
                      sx={{ width: '440px' }}
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

                  <Grid item sx={{ my: 2, display: 'flex', width: '440px' }}>
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

                  <Grid item sx={{ my: 2, display: 'flex', width: '440px' }}>
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
                <Debug />
              </Form>
            )}
          </Formik>
        )}
      </CardContent>
    </Card>
  )
  return content
}

export default NewJobForm
