import {
  Grid,
  Typography,
  Paper,
  Alert,
  Button,
  AlertTitle,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { Form, Formik, Field } from 'formik'
import useAuth from 'hooks/useAuth'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { af2paeJiffySchema } from 'schemas/ValidationSchemas'
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

const Alphafold2PAEJiffy = () => {
  const token = useSelector(selectCurrentToken)
  const navigate = useNavigate()
  // const { resetForm } = useFormikContext()
  const { email } = useAuth()
  const [success, setSuccess] = useState(false)
  const [uuid, setUuid] = useState('')
  const [constfile, setConstfile] = useState('')

  const initialValues = {
    crd_file: '',
    pae_file: '',
    email: email
  }

  const onSubmit = async (values) => {
    console.log('submit form')
    const form = new FormData()
    form.append('crd_file', values.crd_file)
    form.append('pae_file', values.pae_file)
    form.append('email', values.email)
    try {
      const response = await axiosInstance.post('/af2pae', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200) {
        const data = response.data
        setUuid(data.uuid)
        // setConstfile(data.const_file)
        setSuccess(true)
      } else {
        console.log('API request failed')
      }
    } catch (error) {
      console.log('failed')
    }
  }
  const handleReset = () => {
    // resetForm() // Reset the form using resetForm
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
        <Grid item xs={12}>
          <Accordion defaultExpanded={true}>
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
              <Alert severity="warning" sx={{ m: 2 }}>
                This tool is very new and still under active development. If you run into
                any issues please let us know.
              </Alert>
              <Typography sx={{ mx: 1 }}>
                The <b>PAE Jiffy</b> will use the Predicted Alignment Error (PAE) file in
                JSON format from AlphaFold to automagically define the rigid bodies and
                rigid domains of your CRD file, for input into BilboMD.
              </Typography>
              <Typography component={'span'} variant={'body1'}>
                <ol>
                  <li>
                    Obtain the PAE file from AlphaFold. This can either be from running
                    AlphaFold on your own in a colabfold notebook or downloaded from
                    pre-predicted structures available from the{' '}
                    <Link href="https://alphafold.ebi.ac.uk/">AlphaFold</Link> database
                    hosted at EMBL-EBI.
                  </li>
                  <li>
                    Use the <b>PDB Reader</b> tool available from{' '}
                    <a href="https://www.charmm-gui.org/">CHARMM-GUI</a> to convert a
                    standard PDB file to a CRD file.
                  </li>
                  <li>
                    Upload the files here and our server will create a{' '}
                    <code>const.inp</code> file for you. After you download your{' '}
                    <code>const.inp</code> file please check that it makes sense to you
                    before using it in a <b>BilboMD</b> run.
                  </li>
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12}>
          <HeaderBox>
            <Typography>Create const.inp from Alphafold PAE</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            {success ? (
              <>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Your <code>const.inp</code> file was successfully created!
                  <br />
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
                  <Typography style={{ whiteSpace: 'pre-line' }}>{constfile}</Typography>
                  <Box>
                    <CopyToClipboardButton text={constfile} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Download uuid={uuid} />
                  <Button variant="outlined" type="button" onClick={handleReset}>
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
                      direction="column"
                      sx={{ display: 'flex' }}
                    >
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
                      {isSubmitting && (
                        <Box sx={{ width: '520px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      <Grid item xs={6} sx={{ my: 2 }}>
                        <LoadingButton
                          type="submit"
                          disabled={
                            !isValid || values.crd_file === '' || values.pae_file === ''
                          }
                          loading={isSubmitting}
                          endIcon={<SendIcon />}
                          loadingPosition="end"
                          variant="contained"
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
