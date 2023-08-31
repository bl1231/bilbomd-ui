import { Grid, Typography, Paper } from '@mui/material'
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
const initialValues = {
  crd_file: '',
  pae_file: '',
  email: ''
}

const Alphafold2PAEJiffy = () => {
  const { email } = useAuth()
  const [success, setSuccess] = useState(false)
  const [uuid, setUuid] = useState('')
  const [constfile, setConstfile] = useState('')

  const onSubmit = async (values) => {
    console.log('submit form')
    const form = new FormData()
    form.append('psf_file', values.psf_file)
    form.append('pae_file', values.pae_file)
    form.append('email', email)
    try {
      const response = await axiosInstance.post('/af2pae', form)
      if (response.status === 200) {
        const data = response.data
        setUuid(data.uuid)
        setConstfile(data.const_file)
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
      <Grid>
        <Typography sx={HeaderThingee}>Create const.inp file with CRD/PAE</Typography>
        <Item>
          {success ? (
            <>
              <Typography>{uuid}</Typography>
              <Download constfile={constfile} uuid={uuid} />
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
    </>
  )

  return content
}

export default Alphafold2PAEJiffy
