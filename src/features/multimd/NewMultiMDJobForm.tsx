import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'
import { useGetJobsQuery, useAddNewMultiJobMutation } from 'slices/jobsApiSlice'
import {
  Box,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Paper,
  AlertTitle,
  Divider
} from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid2'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { BilboMDJob } from 'types/interfaces'
import HeaderBox from 'components/HeaderBox'
import { Instructions } from './Instructions.tsx'
import { Formik, Form, Field } from 'formik'
import { Debug } from 'components/Debug'

interface SubmitValues {
  title: string
  bilbomdUUIDs: string[]
}

const NewMultiMDJobForm: React.FC = () => {
  const [addNewJob, { isSuccess }] = useAddNewMultiJobMutation()

  const {
    data: jobs,
    isLoading,
    isSuccess: getJobsSuccess,
    isError,
    error
  } = useGetJobsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const initialValues = {
    title: '',
    bilbomdUUIDs: [] as string[]
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Please provide a title for your BilboMD SANS Job.')
      .min(4, 'Title must contain at least 4 characters.')
      .max(30, 'Title must contain less than 30 characters.')
      .matches(/^[\w\s-]+$/, 'No special characters allowed'),
    bilbomdUUIDs: Yup.array().min(2, 'Select at least one job')
  })

  const onSubmit = async (
    values: typeof initialValues,
    { setStatus }: { setStatus: (status: string) => void }
  ) => {
    const form = new FormData()
    form.append('title', values.title)

    // Append each UUID individually
    values.bilbomdUUIDs.forEach((uuid) => form.append('bilbomdUUIDs', uuid))

    try {
      const newJob = await addNewJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const isFormValid = (values: SubmitValues) => {
    return values.title.length > 0 && values.bilbomdUUIDs.length > 0
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Instructions />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>BilboMD Multi Job Form</Typography>
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
                validationSchema={validationSchema}
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
                  status
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
                      <Divider textAlign='left' sx={{ my: 1 }}>
                        Select at Least 2 completed BilboMD Jobs
                      </Divider>
                      <Grid>{isLoading && <CircularProgress />}</Grid>
                      {isSubmitting && (
                        <Box sx={{ my: 1, width: '520px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      {isError && (
                        <Alert severity='error'>{error?.toString()}</Alert>
                      )}
                      {getJobsSuccess && jobs && (
                        <Typography>
                          {' '}
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Select</TableCell>
                                  <TableCell>Title</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>UUID</TableCell>
                                  <TableCell>Time Completed</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {jobs
                                  .filter(
                                    (job: BilboMDJob) =>
                                      job.mongo.status === 'Completed'
                                  )
                                  .map((job: BilboMDJob) => (
                                    <TableRow key={job.mongo.uuid}>
                                      <TableCell>
                                        <Checkbox
                                          checked={values.bilbomdUUIDs.includes(
                                            job.mongo.uuid
                                          )}
                                          onChange={() => {
                                            const isSelected =
                                              values.bilbomdUUIDs.includes(
                                                job.mongo.uuid
                                              )
                                            const updatedSelectedJobUUIDs =
                                              isSelected
                                                ? values.bilbomdUUIDs.filter(
                                                    (id) =>
                                                      id !== job.mongo.uuid
                                                  )
                                                : [
                                                    ...values.bilbomdUUIDs,
                                                    job.mongo.uuid
                                                  ]
                                            handleChange({
                                              target: {
                                                name: 'bilbomdUUIDs',
                                                value: updatedSelectedJobUUIDs
                                              }
                                            })
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>{job.mongo.title}</TableCell>
                                      <TableCell>{job.mongo.__t}</TableCell>
                                      <TableCell>{job.mongo.status}</TableCell>
                                      <TableCell>{job.mongo.uuid}</TableCell>
                                      <TableCell>
                                        {job.mongo.time_completed
                                          ? new Date(
                                              job.mongo.time_completed
                                            ).toLocaleString()
                                          : 'N/A'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Typography>
                      )}
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
    </Box>
  )
}

export default NewMultiMDJobForm
