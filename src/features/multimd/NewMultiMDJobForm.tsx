import React from 'react'
import { Link as RouterLink } from 'react-router'
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
  Divider,
  Radio
} from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { BilboMDJob } from 'types/interfaces'
import HeaderBox from 'components/HeaderBox'
import { Instructions } from './Instructions.tsx'
import { Formik, Form, Field } from 'formik'
import { Debug } from 'components/Debug'
import useAuth from 'hooks/useAuth'

interface SubmitValues {
  title: string
  bilbomd_uuids: string[]
  data_file_from: string
}

interface ApiError {
  status: number
  data?: {
    message?: string
  }
}

const NewMultiMDJobForm: React.FC = () => {
  const [addNewJob, { isSuccess }] = useAddNewMultiJobMutation()
  const { username } = useAuth()
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
    bilbomd_uuids: [] as string[],
    data_file_from: ''
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Please provide a title for your BilboMD Multi Job.')
      .min(4, 'Title must contain at least 4 characters.')
      .max(30, 'Title must contain less than 30 characters.')
      .matches(/^[\w\s-]+$/, 'No special characters allowed'),
    bilbomd_uuids: Yup.array().min(2, 'Select at least two jobs to combine'),
    data_file_from: Yup.string()
      .required(
        'Select the BilboMD Job that has the dataset to use for the BilboMD Multi run'
      )
      .test(
        'is-in-bilbomd-uuids',
        'Select a SAXS dataset from a job being combined',
        function (value) {
          const { bilbomd_uuids } = this.parent
          return bilbomd_uuids.includes(value)
        }
      )
  })

  const onSubmit = async (
    values: typeof initialValues,
    { setStatus }: { setStatus: (status: string | null) => void }
  ) => {
    const form = new FormData()
    form.append('title', values.title)
    values.bilbomd_uuids.forEach((uuid) => form.append('bilbomd_uuids', uuid))
    form.append('data_file_from', values.data_file_from)

    try {
      const newJob = await addNewJob(form).unwrap()
      setStatus(null)
      console.log('Job created successfully:', newJob)
    } catch (error: unknown) {
      if (isApiError(error)) {
        // If the error is from the API, extract the message
        setStatus(error.data?.message || 'An unexpected error occurred.')
      } else {
        // Generic fallback for unexpected errors
        console.error('Unexpected error:', error)
        setStatus('An unexpected error occurred.')
      }
    }
  }

  const isApiError = (error: unknown): error is ApiError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as ApiError).status === 'number'
    )
  }

  const isFormValid = (values: SubmitValues) => {
    return (
      values.title.trim().length > 0 &&
      values.bilbomd_uuids.length > 0 &&
      values.data_file_from.trim().length > 0
    )
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Instructions />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Box display='flex' alignItems='center'>
              <Typography>BilboMD Multi Job Form</Typography>
              <Typography component='span' sx={{ color: 'yellow', ml: 1 }}>
                *beta - please send ideas and feedback to scott
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
                  setFieldValue,
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
                        <Box>
                          {' '}
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Combine</TableCell>
                                  <TableCell>Select SAXS Data</TableCell>
                                  <TableCell>Title</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>Exp. Rg</TableCell>
                                  <TableCell>Time Completed</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {jobs
                                  .filter((job: BilboMDJob) => {
                                    if (job.username !== username) {
                                      return false
                                    }
                                    return (
                                      job.mongo.status === 'Completed' &&
                                      [
                                        'BilboMdPDB',
                                        'BilboMdCRD',
                                        'BilboMdAuto',
                                        'BilboMdAlphaFold'
                                      ].includes(job.mongo.__t)
                                    )
                                  })
                                  .map((job: BilboMDJob) => (
                                    <TableRow key={job.mongo.uuid}>
                                      <TableCell>
                                        <Checkbox
                                          checked={values.bilbomd_uuids.includes(
                                            job.mongo.uuid
                                          )}
                                          onChange={() => {
                                            const isSelected =
                                              values.bilbomd_uuids.includes(
                                                job.mongo.uuid
                                              )
                                            const updatedSelectedJobUUIDs =
                                              isSelected
                                                ? values.bilbomd_uuids.filter(
                                                    (id) =>
                                                      id !== job.mongo.uuid
                                                  )
                                                : [
                                                    ...values.bilbomd_uuids,
                                                    job.mongo.uuid
                                                  ]
                                            setFieldValue(
                                              'bilbomd_uuids',
                                              updatedSelectedJobUUIDs
                                            )
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Radio
                                          checked={
                                            values.data_file_from ===
                                            job.mongo.uuid
                                          }
                                          onChange={() =>
                                            setFieldValue(
                                              'data_file_from',
                                              job.mongo.uuid
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>{job.mongo.title}</TableCell>
                                      <TableCell>{job.mongo.__t}</TableCell>
                                      <TableCell>{job.mongo.status}</TableCell>
                                      <TableCell>
                                        {'rg' in job.mongo
                                          ? `${job.mongo.rg} Å`
                                          : 'N/A'}
                                      </TableCell>
                                      <TableCell>
                                        {job.mongo.time_completed
                                          ? new Date(
                                              job.mongo.time_completed
                                            ).toLocaleString()
                                          : 'N/A'}
                                      </TableCell>
                                    </TableRow>
                                  ))}

                                {/* Render an alert when no jobs are available */}
                                {jobs.filter((job: BilboMDJob) => {
                                  if (job.username !== username) {
                                    return false
                                  }
                                  return (
                                    job.mongo.status === 'Completed' &&
                                    [
                                      'BilboMdPDB',
                                      'BilboMdCRD',
                                      'BilboMdAuto',
                                      'BilboMdAlphaFold'
                                    ].includes(job.mongo.__t)
                                  )
                                }).length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={7}>
                                      <Alert severity='warning'>
                                        Please run some BilboMD Jobs first.
                                      </Alert>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}
                      <Grid sx={{ mt: 2 }}>
                        {/* Backend Error Alert */}
                        {status && (
                          <Alert severity='error' sx={{ mb: 2 }}>
                            <AlertTitle>Backend Error:</AlertTitle>
                            <Typography variant='body1'>{status}</Typography>
                            <Typography variant='body2'>
                              This shouldn&apos;t happen. Please let Scott know
                              about this.
                            </Typography>
                          </Alert>
                        )}
                        {/* Form Validation Errors Alert */}
                        {Object.keys(errors).length > 0 ? (
                          <Alert severity='error' sx={{ mb: 2 }}>
                            {Object.values(errors).map((error, index) => (
                              <div key={index}>{error}</div>
                            ))}
                          </Alert>
                        ) : (
                          isFormValid(values) && (
                            <Alert severity='success' sx={{ mb: 2 }}>
                              <Typography variant='body2'>
                                All fields are valid and ready to submit!
                              </Typography>
                            </Alert>
                          )
                        )}
                        <LoadingButton
                          type='submit'
                          disabled={!isValid || isSubmitting}
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
