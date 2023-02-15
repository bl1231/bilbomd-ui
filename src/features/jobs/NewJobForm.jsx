import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  AlertTitle,
  FormLabel,
  FormControl,
  Link
} from '@mui/material'
import Input from '@mui/material/Input'
//import InputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import { useAddNewJobMutation } from './jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { Form, Formik, Field } from 'formik'
import { MultipleFileUploadField } from './MultipleFileUploadField'
//import { Debug } from 'components/Debug'
import { bilbomdJobSchema } from 'schemas/ValidationSchemas'
import { useNavigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'
import React, { useState } from 'react'

const initialValues = {
  title: '',
  pdbs: [
    {
      file: '',
      errors: [],
      id: '',
      uuid: ''
    }
  ],
  constinp: '',
  expdata: '',
  num_conf: '',
  rg_min: '',
  rg_max: '',
  email: ''
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const NewJobForm = () => {
  const [addNewJob, { isLoading, isSuccess, isError, error }] = useAddNewJobMutation()
  const { email } = useAuth()
  const navigate = useNavigate()
  const [expdataFileName, setExpdataFileName] = useState('')
  const [constinpFileName, setConstinpFileName] = useState('')
  const [jobid, setJobid] = useState('')

  const onSubmit = async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    //console.log('form values: ', values)
    //await sleep(500)
    const form = new FormData()
    //await sleep(1000)
    form.append('title', values.title)

    values.pdbs.forEach((pdb, index) => {
      form.append(`pdb_${index + 1}`, pdb.file)
    })

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
                  <Grid item sx={{ my: 2, display: 'flex', width: '400px' }}>
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
                      error={Boolean(errors.title) && Boolean(touched.title)}
                      helperText={
                        Boolean(errors.title) && Boolean(touched.title)
                          ? errors.title
                          : ''
                      }
                      value={values.title || ''}
                    />
                  </Grid>

                  <Grid item sx={{ my: 2, display: 'flex', width: '400px' }}>
                    <FormControl>
                      <FormLabel sx={{ marginBottom: '0.8em' }}>PDB Files</FormLabel>
                      <MultipleFileUploadField name="pdbs" />
                    </FormControl>
                  </Grid>

                  <Grid container direction="row">
                    <Grid item sx={{ my: 2, display: 'flex' }}>
                      <FormControl>
                        <FormLabel sx={{ marginBottom: '0.8em' }}>
                          Upload your <b>const.inp</b> file
                        </FormLabel>
                        <Button
                          variant="contained"
                          component="label"
                          sx={{ mr: 2, width: '100px' }}
                        >
                          Select File
                          <Input
                            sx={{ display: 'none' }}
                            type="file"
                            disabled={isSubmitting}
                            name="constinp"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0]
                              setConstinpFileName(event.currentTarget.files[0].name)
                              setFieldValue('constinp', file)
                            }}
                          />
                        </Button>
                      </FormControl>
                    </Grid>
                    <Grid item sx={{ m: 2, display: 'flex', alignItems: 'end' }}>
                      <Typography variant="h5">{constinpFileName}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container direction="row" sx={{ mb: 2 }}>
                    <Grid item sx={{ my: 2, display: 'flex' }}>
                      <FormControl>
                        <FormLabel sx={{ marginBottom: '0.8em' }}>
                          Upload your experimental data
                        </FormLabel>
                        <Button
                          variant="contained"
                          component="label"
                          sx={{ mr: 2, width: '100px' }}
                        >
                          Select File
                          <Input
                            sx={{ display: 'none' }}
                            type="file"
                            disabled={isSubmitting}
                            name="expdata"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0]
                              setExpdataFileName(event.currentTarget.files[0].name)
                              setFieldValue('expdata', file)
                            }}
                          />
                        </Button>
                      </FormControl>
                    </Grid>
                    <Grid item sx={{ m: 2, display: 'flex', alignItems: 'end' }}>
                      <Typography variant="h5">{expdataFileName}</Typography>
                    </Grid>
                  </Grid>

                  <Grid item sx={{ my: 2, display: 'flex', width: '400px' }}>
                    <TextField
                      label="Conformations per Rg"
                      variant="outlined"
                      id="num_conf"
                      name="num_conf"
                      select
                      defaultValue=""
                      sx={{ width: '400px' }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.num_conf) && Boolean(touched.num_conf)}
                      helperText={
                        Boolean(errors.num_conf) && Boolean(touched.num_conf)
                          ? errors.num_conf
                          : 'Number of conformations to sample per Rg'
                      }
                    >
                      <MenuItem key={200} value={200}>
                        200
                      </MenuItem>
                      <MenuItem key={400} value={400}>
                        400
                      </MenuItem>
                      <MenuItem key={600} value={600}>
                        600
                      </MenuItem>
                      <MenuItem key={800} value={800}>
                        800
                      </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item sx={{ my: 2, display: 'flex', width: '400px' }}>
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
                      error={Boolean(errors.rg_min) && Boolean(touched.rg_min)}
                      helperText={
                        Boolean(errors.rg_min) && Boolean(touched.rg_min)
                          ? errors.rg_min
                          : 'Min value of Rg ...(between 10 and 100)'
                      }
                    />
                  </Grid>

                  <Grid item sx={{ my: 2, display: 'flex', width: '400px' }}>
                    <Field
                      label="Rg Max"
                      fullWidth
                      id="rg_max"
                      name="rg_max"
                      type="text"
                      disabled={isSubmitting}
                      as={TextField}
                      helperText={
                        Boolean(errors.rg_max) && Boolean(touched.rg_max)
                          ? errors.rg_max
                          : 'Max value of Rg ...(between 10 and 100)'
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.rg_max) && Boolean(touched.rg_max)}
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
      </CardContent>
    </Card>
  )
  return content
}

export default NewJobForm
