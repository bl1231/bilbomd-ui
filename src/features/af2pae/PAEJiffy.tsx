import {
  Typography,
  Paper,
  Alert,
  Button,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import { Form, Formik, Field, FormikHelpers } from 'formik'
import { useState, useEffect } from 'react'
import { af2paeJiffySchema } from 'schemas/Alphafold2PAEValidationSchema'
import FileSelect from 'features/jobs/FileSelect'
import { Debug } from 'components/Debug'
import SendIcon from '@mui/icons-material/Send'
import Download from './DownloadAF2PAEfile'
import { Box } from '@mui/system'
import {
  useAf2PaeJiffyMutation,
  useGetAf2PaeStatusQuery,
  useGetAf2PaeConstFileQuery
} from 'slices/jobsApiSlice'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import PAESlider from './PAESlider'
import PlddtSlider from './PlddtSlider'
import PAEJiffyInstructions from './PAEJiffyInstructions'
import ConstInpFile from './ConstInpFile'

interface FileWithDeets extends File {
  name: string
}

interface FormValues {
  pdb_file: FileWithDeets | null
  pae_file: FileWithDeets | null
  pae_power: string
  plddt_cutoff: string
}

const Alphafold2PAEJiffy = () => {
  const [originalFiles, setOriginalFiles] = useState<{
    pdb_file: FileWithDeets | null
    pae_file: FileWithDeets | null
  }>({ pdb_file: null, pae_file: null })

  const [calculateAf2PaeJiffy, { error, isError }] = useAf2PaeJiffyMutation({})
  const [success, setSuccess] = useState(false)
  const [uuid, setUuid] = useState('')
  const [status, setStatus] = useState('')
  const [constfile, setConstfile] = useState('')
  const [shapeCount, setShapeCount] = useState(0)
  const [jobStartTime, setJobStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const {
    data: statusData,
    isLoading: statusIsLoading,
    isError: statusIsError
  } = useGetAf2PaeStatusQuery(uuid, {
    skip: !uuid || !success,
    pollingInterval: 5000
  })

  useEffect(() => {
    if (statusData?.status) {
      setStatus(statusData.status)
    }
  }, [statusData])

  const [formInitialValues, setFormInitialValues] = useState<FormValues>({
    pdb_file: originalFiles.pdb_file,
    pae_file: originalFiles.pae_file,
    pae_power: '2.0',
    plddt_cutoff: '50'
  })

  const onSubmit = async (values: FormValues) => {
    const form = new FormData()
    if (!values.pdb_file || !values.pae_file) {
      // Handle error or return early
      return
    }
    form.append('pdb_file', values.pdb_file, values.pdb_file.name)
    form.append('pae_file', values.pae_file, values.pae_file.name)
    form.append('pae_power', values.pae_power)
    form.append('plddt_cutoff', values.plddt_cutoff)
    try {
      const response = await calculateAf2PaeJiffy(form).unwrap()
      setUuid(response.uuid)
      setJobStartTime(Date.now())
      setSuccess(true)
      setFormInitialValues(values)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  useEffect(() => {
    if (!success || status === 'completed') return
    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        if (jobStartTime) {
          return Math.floor((Date.now() - jobStartTime) / 1000)
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [success, status, jobStartTime])

  const handleTryNewParameters = (
    values: FormValues,
    resetForm: FormikHelpers<FormValues>['resetForm']
  ) => {
    const newInitial = {
      ...formInitialValues,
      pae_power: values.pae_power,
      plddt_cutoff: values.plddt_cutoff,
      pdb_file: originalFiles.pdb_file,
      pae_file: originalFiles.pae_file
    }

    setFormInitialValues(newInitial)
    resetForm({ values: newInitial })
    setSuccess(false)
  }

  const handleReset = () => {
    setSuccess(false)
    setUuid('')
    setStatus('')
    setConstfile('')
    setShapeCount(0)
    setOriginalFiles({ pdb_file: null, pae_file: null })
  }

  const skipQuery = !uuid || status !== 'completed'

  const {
    data: constInpData,
    error: fileError,
    isLoading: constFileIsLoading
  } = useGetAf2PaeConstFileQuery(uuid, {
    skip: skipQuery
  })

  useEffect(() => {
    if (constInpData) {
      const shapeCount = (constInpData.match(/shape/g) || []).length
      setShapeCount(shapeCount)
      setConstfile(constInpData)
    }
  }, [constInpData])

  useEffect(() => {
    setFormInitialValues((prev) => ({
      ...prev,
      pdb_file: originalFiles.pdb_file,
      pae_file: originalFiles.pae_file
    }))
  }, [originalFiles])

  const content = (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <PAEJiffyInstructions />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Typography>Create const.inp from AlphaFold PAE</Typography>
        </HeaderBox>
        <Paper sx={{ p: 1 }}>
          <Formik
            initialValues={formInitialValues}
            validationSchema={af2paeJiffySchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              touched,
              errors,
              isValid,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
              resetForm
            }) => {
              if (success) {
                return (
                  <>
                    {success && status !== 'completed' && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          my: 3
                        }}
                      >
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>
                          Waiting for job to complete... current status:{' '}
                          {status}
                        </Typography>
                        <Typography sx={{ mt: 1, color: 'error.main' }}>
                          Jobs can take 5-6 minutes.
                        </Typography>
                        <Typography
                          sx={{ mt: 1, fontSize: '1.2rem' }}
                          data-testid='job-timer'
                        >
                          Time elapsed:{' '}
                          {`${Math.floor(timeElapsed / 60)
                            .toString()
                            .padStart(2, '0')} min ${(timeElapsed % 60)
                            .toString()
                            .padStart(2, '0')} sec`}
                        </Typography>
                      </Box>
                    )}
                    {statusIsError && (
                      <Typography color='error'>
                        Error checking job status
                      </Typography>
                    )}
                    {constFileIsLoading && (
                      <Typography>Loading const.inp file...</Typography>
                    )}
                    {fileError && (
                      <Typography color='error'>
                        Error fetching const.inp file
                      </Typography>
                    )}

                    {status === 'completed' && (
                      <>
                        <Alert
                          severity={shapeCount >= 20 ? 'error' : 'success'}
                        >
                          <AlertTitle>
                            {shapeCount >= 20 ? 'Error' : 'Success'}
                          </AlertTitle>
                          Your CHARMM-compatible <code>const.inp</code> file was
                          successfully created!{' '}
                          {values && shapeCount >= 20
                            ? `But with Clustering Weight = ${parseFloat(values.pae_power).toFixed(1)} there are ${shapeCount} rigid bodies which is too many for CHARMM to handle.`
                            : ''}
                          <br />
                          {values && (
                            <>
                              <TableContainer sx={{ width: '400px' }}>
                                <Table aria-label='simple table'>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        <b>PDB File</b>
                                      </TableCell>
                                      <TableCell align='right'>
                                        {values.pdb_file?.name}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        <b>PAE File</b>
                                      </TableCell>
                                      <TableCell align='right'>
                                        {values.pae_file?.name}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        <b>Clustering Weight</b>
                                      </TableCell>
                                      <TableCell align='right'>
                                        {parseFloat(values.pae_power).toFixed(
                                          1
                                        )}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        <b>pLDDT Cutoff</b>
                                      </TableCell>
                                      <TableCell align='right'>
                                        {parseFloat(
                                          values.plddt_cutoff
                                        ).toFixed(1)}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        <b>CHARMM shapes (max 20)</b>
                                      </TableCell>
                                      <TableCell align='right'>
                                        {shapeCount}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </>
                          )}
                        </Alert>

                        <ConstInpFile constfile={constfile} />

                        <Box
                          sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}
                        >
                          <Download uuid={uuid} />
                          <Button
                            variant='contained'
                            onClick={() =>
                              handleTryNewParameters(values, resetForm)
                            }
                          >
                            Try New Parameters
                          </Button>
                          <Button
                            variant='outlined'
                            type='button'
                            onClick={() => {
                              handleReset()
                              const resetValues = {
                                pdb_file: null,
                                pae_file: null,
                                pae_power: '2.0',
                                plddt_cutoff: '50'
                              }
                              resetForm({ values: resetValues })
                              setFormInitialValues(resetValues)
                            }}
                            sx={{ ml: 2 }}
                          >
                            Reset
                          </Button>
                        </Box>
                      </>
                    )}
                  </>
                )
              } else {
                return (
                  <Form>
                    <Grid
                      container
                      columns={12}
                      direction='column'
                      sx={{ display: 'flex' }}
                    >
                      {isError && (
                        <Alert severity='error' sx={{ my: 2 }}>
                          <AlertTitle>Error</AlertTitle>
                          {(() => {
                            if (!error) return 'An unknown error occurred.'
                            if (typeof error === 'string') return error
                            if (
                              'data' in error &&
                              typeof error.data === 'object' &&
                              error.data !== null &&
                              'message' in error.data
                            ) {
                              return (
                                (error.data as { message?: string }).message ||
                                'An error occurred.'
                              )
                            }
                            if ('message' in error) {
                              return (
                                (error as { message?: string }).message ||
                                'An error occurred.'
                              )
                            }
                            return 'An unknown error occurred.'
                          })()}
                        </Alert>
                      )}
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
                        fileType='AlphaFold2 PDB *.pdb'
                        fileExt='.pdb'
                        onFileChange={(file: FileWithDeets) => {
                          setFieldValue('pdb_file', file)
                          setOriginalFiles((prev) => ({
                            ...prev,
                            pdb_file: file
                          }))
                        }}
                      />
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
                        onFileChange={(file: FileWithDeets) => {
                          setFieldValue('pae_file', file)
                          setOriginalFiles((prev) => ({
                            ...prev,
                            pae_file: file
                          }))
                        }}
                      />
                      <Field
                        name='pae_power'
                        id='pae-power-slider'
                        as={PAESlider}
                        setFieldValue={setFieldValue}
                        value={values.pae_power}
                      />
                      <Field
                        name='plddt_cutoff'
                        id='plddt-cutoff-slider'
                        as={PlddtSlider}
                        setFieldValue={setFieldValue}
                        value={values.plddt_cutoff}
                      />
                      {isSubmitting && (
                        <Box sx={{ mt: 1, width: '420px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      <Grid size={{ xs: 6 }} sx={{ my: 2 }}>
                        <Button
                          type='submit'
                          disabled={
                            !isValid ||
                            values.pdb_file === null ||
                            values.pae_file === null
                          }
                          loading={isSubmitting}
                          endIcon={<SendIcon />}
                          loadingPosition='end'
                          variant='contained'
                          sx={{ width: '110px' }}
                        >
                          <span>Submit</span>
                        </Button>
                      </Grid>
                      {process.env.NODE_ENV === 'development' ? <Debug /> : ''}
                    </Grid>
                  </Form>
                )
              }
            }}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  )

  return content
}

export default Alphafold2PAEJiffy
