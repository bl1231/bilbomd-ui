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
import Grid from '@mui/material/Grid2'
import { Form, Formik, Field } from 'formik'
import useAuth from 'hooks/useAuth'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { af2paeJiffySchema } from 'schemas/Alphafold2PAEValidationSchema'
import FileSelect from 'features/jobs/FileSelect'
import { Debug } from 'components/Debug'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import Download from './DownladAF2PAEfile'
import { Box } from '@mui/system'
import {
  useAf2PaeJiffyMutation,
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
  email: string
}

const Alphafold2PAEJiffy = () => {
  const [originalFiles, setOriginalFiles] = useState<{
    pdb_file: FileWithDeets | null
    pae_file: FileWithDeets | null
  }>({ pdb_file: null, pae_file: null })

  const [calculateAf2PaeJiffy, { error, isError }] = useAf2PaeJiffyMutation({})
  const navigate = useNavigate()
  const { email } = useAuth()
  const [formValues, setFormValues] = useState<FormValues | null>(null)
  const [success, setSuccess] = useState(false)
  const [uuid, setUuid] = useState('')
  const [constfile, setConstfile] = useState('')
  const [shapeCount, setShapeCount] = useState(0)

  const [formInitialValues, setFormInitialValues] = useState<FormValues>({
    pdb_file: originalFiles.pdb_file,
    pae_file: originalFiles.pae_file,
    pae_power: '2.0',
    plddt_cutoff: '50',
    email: email
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
    form.append('email', values.email)
    setFormValues(values)
    try {
      const response = await calculateAf2PaeJiffy(form).unwrap()
      setUuid(response.uuid)
      setSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    navigate('/dashboard/af2pae')
  }

  const skipQuery = !uuid

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

  const content = (
    <Grid container spacing={3}>
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
            // enableReinitialize={true}
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
                    {constFileIsLoading && (
                      <Typography>Loading const.inp file...</Typography>
                    )}
                    {fileError && (
                      <Typography color='error'>
                        Error fetching const.inp file
                      </Typography>
                    )}

                    <Alert severity={shapeCount >= 20 ? 'error' : 'success'}>
                      <AlertTitle>
                        {shapeCount >= 20 ? 'Error' : 'Success'}
                      </AlertTitle>
                      Your CHARMM-compatible <code>const.inp</code> file was
                      successfully created!{' '}
                      {formValues && shapeCount >= 20
                        ? `But with Clustering Weight = ${parseFloat(formValues.pae_power).toFixed(1)} there are ${shapeCount} rigid bodies which is too many for CHARMM to handle.`
                        : ''}
                      <br />
                      {formValues && (
                        <>
                          <TableContainer sx={{ width: '400px' }}>
                            <Table aria-label='simple table'>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <b>PDB File</b>
                                  </TableCell>
                                  <TableCell align='right'>
                                    {formValues.pdb_file?.name}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    <b>PAE File</b>
                                  </TableCell>
                                  <TableCell align='right'>
                                    {formValues.pae_file?.name}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    <b>Clustering Weight</b>
                                  </TableCell>
                                  <TableCell align='right'>
                                    {parseFloat(formValues.pae_power).toFixed(
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
                                      formValues.plddt_cutoff
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

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Download uuid={uuid} />
                      <Button
                        variant='contained'
                        onClick={() => {
                          console.log('Resetting form')
                          console.log('formValues:', formValues)
                          const newInitial = {
                            ...formInitialValues,
                            pae_power: formValues?.pae_power || '2.0',
                            plddt_cutoff: formValues?.plddt_cutoff || '50',
                            pdb_file: originalFiles.pdb_file,
                            pae_file: originalFiles.pae_file
                          }
                          setFormInitialValues(newInitial)
                          resetForm({ values: newInitial })
                          handleReset()
                        }}
                      >
                        Try New Parameters
                      </Button>
                      <Button
                        variant='outlined'
                        type='button'
                        onClick={handleReset}
                        sx={{ ml: 2 }}
                      >
                        Reset
                      </Button>
                    </Box>
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
                        <Typography color='error'>
                          An error occurred: {error && error.toString()}
                        </Typography>
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
                          setFormInitialValues((prev) => ({
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
                          setFormInitialValues((prev) => ({
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
                      />
                      <Field
                        name='plddt_cutoff'
                        id='plddt-cutoff-slider'
                        as={PlddtSlider}
                        setFieldValue={setFieldValue}
                      />
                      {isSubmitting && (
                        <Box sx={{ mt: 1, width: '420px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      <Grid size={{ xs: 6 }} sx={{ my: 2 }}>
                        <LoadingButton
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
                        </LoadingButton>
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
