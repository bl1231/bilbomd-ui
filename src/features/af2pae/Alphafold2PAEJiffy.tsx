import { Grid, Typography, Paper, Alert, Button, AlertTitle, Link } from '@mui/material'
import { Form, Formik, Field } from 'formik'
import useAuth from 'hooks/useAuth'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { af2paeJiffySchema } from 'schemas/ValidationSchemas'
import FileInput from 'features/jobs/FileInput'
import { Debug } from 'components/Debug'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import axiosInstance from 'app/api/axios'
import Download from './DownladAF2PAEfile'
import { Box } from '@mui/system'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
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
  letterSpacing: '1px',
  py: 2
}

const Alphafold2PAEJiffy = () => {
  const { email } = useAuth()
  const [success, setSuccess] = useState(false)
  const [uuid, setUuid] = useState('')
  // const [constfile, setConstfile] = useState('')

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
      const response = await axiosInstance.post('/af2pae', form)
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

  const content = (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Instructions</Typography>
          <Item>
            <Typography>
              The <b>PAE Jiffy</b> will use the PAE file from AlphaFold to automagically
              define the rigid bodies and rigid domains of your CRD file, for input into
              BilboMD.
            </Typography>
            <Typography component={'span'} variant={'body1'}>
              <ol>
                <li>
                  Obtain the Predicted Alignment Error (PAE) file in JSON format from
                  Alphafold2. This can either be from running Alphfold2 on your own in a
                  colabfold notebook or downloaded from pre-predicted structures available
                  from the <Link href="https://alphafold.ebi.ac.uk/">AlphaFold</Link>{' '}
                  database hosted at EMBL-EBI.
                </li>
                <li>
                  Use the <b>PDB Reader</b> tool available from{' '}
                  <a href="https://www.charmm-gui.org/">CHARMM-GUI</a> to convert a
                  standard PDB file to a CRD file.
                </li>
                <li>
                  Upload the files here and our server will create a{' '}
                  <code>const.inp</code> file for you. After you download the file please
                  check that it makes sense to you before using it in a <b>BilboMD</b>{' '}
                  run.
                </li>
              </ol>
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Create const.inp file from CRD/PAE</Typography>
          <Item>
            {success ? (
              <>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Your <code>const.inp</code> file was successfully created!
                  <br />
                  UUID: {uuid}
                </Alert>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Download uuid={uuid} />
                  <Button
                    variant="outlined"
                    type="button"
                    onClick={() => window.location.reload()}
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
                        as={FileInput}
                        title="Select File"
                        disabled={isSubmitting}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.crd_file && values.crd_file}
                        errorMessage={errors.crd_file ? errors.crd_file : ''}
                        helperText="Select a CRD file to upload"
                        fileType="*.crd"
                        fileExt=".crd"
                      />
                      <Field
                        name="pae_file"
                        id="pae-file-upload"
                        as={FileInput}
                        title="Select File"
                        disabled={isSubmitting}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.pae_file}
                        errorMessage={errors.pae_file ? errors.pae_file : ''}
                        helperText="Select a PAE JSON file to upload"
                        fileType="*.json"
                        fileExt=".json"
                      />
                      <Grid item xs={6} sx={{ my: 2 }}>
                        <LoadingButton
                          type="submit"
                          disabled={!isValid}
                          loading={isSubmitting}
                          endIcon={<SendIcon />}
                          loadingPosition="end"
                          variant="contained"
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
          </Item>
        </Grid>
      </Grid>
    </>
  )

  return content
}

export default Alphafold2PAEJiffy
