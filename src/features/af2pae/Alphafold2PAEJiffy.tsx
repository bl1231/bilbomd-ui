import {
  Typography,
  Paper,
  Alert,
  Button,
  AlertTitle,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import { useNavigate } from 'react-router-dom'
import { af2paeJiffySchema } from 'schemas/Alphafold2PAEValidationSchema'
import FileSelect from 'features/jobs/FileSelect'
import { Debug } from 'components/Debug'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { axiosInstance } from 'app/api/axios'
import Download from './DownladAF2PAEfile'
import CopyToClipboardButton from 'components/Common/CopyToClipboardButton'
import { Box } from '@mui/system'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import PAESlider from './PAESlider'

interface FileWithDeets extends File {
  name: string
}

interface FormValues {
  pdb_file: FileWithDeets | null
  pae_file: FileWithDeets | null
  pae_power: string
  email: string
}

const Alphafold2PAEJiffy = () => {
  const token = useSelector(selectCurrentToken)
  const navigate = useNavigate()
  const { email } = useAuth()
  const [formValues, setFormValues] = useState<FormValues | null>(null)
  const [success, setSuccess] = useState(false)
  const [uuid, setUuid] = useState('')
  const [constfile, setConstfile] = useState('')
  const [shapeCount, setShapeCount] = useState(0)

  const initialValues: FormValues = {
    pdb_file: null,
    pae_file: null,
    pae_power: '',
    email: email
  }

  const onSubmit = async (values: FormValues) => {
    const form = new FormData()
    if (values.pdb_file) {
      form.append('pdb_file', values.pdb_file)
    }
    if (values.pae_file) {
      form.append('pae_file', values.pae_file)
    }
    form.append('pae_power', values.pae_power)
    form.append('email', values.email)
    setFormValues(values)
    try {
      const response = await axiosInstance.post('/af2pae', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200) {
        const data = response.data
        console.log(data)
        setUuid(data.uuid)
        setSuccess(true)
      } else {
        console.log('API request failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    navigate('/dashboard/af2pae')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!uuid) {
          return // Don't make the request if uuid is undefined
        }

        const response = await axiosInstance.get(`af2pae?uuid=${uuid}`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.data) {
          throw new Error('Failed to fetch file content')
        }

        const blob = response.data
        const text = await new Response(blob).text()
        const shapeCount = (text.match(/shape/g) || []).length
        setShapeCount(shapeCount)
        setConstfile(text)
      } catch (error) {
        console.error('Error fetching file content:', error)
      }
    }

    fetchData()
  }, [uuid, token])

  const content = (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Accordion defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{
                backgroundColor: '#888',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                pl: 0
              }}
            >
              <HeaderBox sx={{ py: 0 }}>
                <Typography>Instructions</Typography>
              </HeaderBox>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ mx: 1 }}>
                The <b>PAE Jiffy</b>
                {'\u2122'} will use the{' '}
                <Link
                  href='https://alphafold.ebi.ac.uk/faq#faq-13'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Predicted Aligned Error
                </Link>{' '}
                (PAE) file - in JSON format - from AlphaFold to{' '}
                <b>automagically*</b> define the rigid bodies and rigid domains.
                The <b>*.pdb</b> and PAE <b>*.json</b> files must be the ones
                obtained from AlphaFold since we are also using the{' '}
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
              <Typography component={'span'} variant={'body1'}>
                <ol>
                  <li>
                    Obtain the PAE file from AlphaFold2 or AlphaFold-Multimer.
                    Either from running AlphaFold on your own in a colabfold
                    notebook or downloaded from pre-predicted structures
                    available from the{' '}
                    <Link
                      href='https://alphafold.ebi.ac.uk/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      AlphaFold
                    </Link>{' '}
                    database hosted at EMBL-EBI.
                  </li>
                  <li>
                    Upload the files here and our server will create a
                    CHARMM-compatable <code>const.inp</code> file for you. After
                    you download your <code>const.inp</code> file please check
                    that it makes sense to you before using it in a{' '}
                    <b>BilboMD</b> run.
                  </li>
                </ol>
              </Typography>
              <Typography>
                *The <b>PAE Jiffy</b>
                {'\u2122'} uses the{' '}
                <Link
                  href='https://igraph.org/r/html/1.3.0/cluster_leiden.html'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  cluster_leiden()
                </Link>{' '}
                function from{' '}
                <Link
                  href='https://igraph.org/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  igraph
                </Link>{' '}
                to find the community structure of a graph using the Leiden
                algorithm of{' '}
                <Link
                  href='https://doi.org/10.1038/s41598-019-41695-z'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {' '}
                  Traag, van Eck & Waltman
                </Link>
                .
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>Create const.inp from AlphaFold PAE</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            {success ? (
              <>
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
                          {/* <TableHead>
                            <TableRow>
                              <TableCell>
                                <b>Field</b>
                              </TableCell>
                              <TableCell align='right'>
                                <b>Value</b>
                              </TableCell>
                            </TableRow>
                          </TableHead> */}
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
                                {parseFloat(formValues.pae_power).toFixed(1)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <b>CHARMM shapes (max 20)</b>
                              </TableCell>
                              <TableCell align='right'>{shapeCount}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </Alert>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    borderRadius: '4px',
                    p: 2,
                    my: 1,
                    backgroundColor: '#bae0ff',
                    color: 'black'
                  }}
                >
                  <Typography style={{ whiteSpace: 'pre-line' }}>
                    {constfile}
                  </Typography>
                  <Box>
                    <CopyToClipboardButton text={constfile} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Download uuid={uuid} />
                  <Button
                    variant='outlined'
                    type='button'
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Box>
              </>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={af2paeJiffySchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  touched,
                  errors,
                  isValid,
                  isSubmitting,
                  setFieldValue,
                  setFieldTouched
                }) => (
                  <Form>
                    <Grid
                      container
                      columns={12}
                      direction='column'
                      sx={{ display: 'flex' }}
                    >
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
                      />
                      <Field
                        name='pae_power'
                        id='pae-power-slider'
                        as={PAESlider}
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

export default Alphafold2PAEJiffy
