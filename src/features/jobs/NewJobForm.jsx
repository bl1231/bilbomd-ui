import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  FormControlLabel,
  FormLabel,
  FormControl
} from '@mui/material'
import { useAddNewJobMutation } from './jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { Form, Formik, Field } from 'formik'
import { Select, SimpleFileUpload } from 'formik-mui'
import { MultipleFileUploadField } from './MultipleFileUploadField'
import { Debug } from 'components/Debug'
import { bilbomdJobSchema } from 'schemas/ValidationSchemas'
import { useNavigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'

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
  const { username, email } = useAuth()
  const history = useNavigate()

  const onSubmit = async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    console.log('form values: ', values)
    //await sleep(500)
    const form = new FormData()
    await sleep(1000)
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
    for (const value of form.values()) {
      console.log(value)
    }
    //await addNewJob(form)

    try {
      const payload = await addNewJob(form).unwrap()
      console.log('fulfilled', payload)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const content = (
    <Card>
      {email}
      <CardContent>
        <Formik
          initialValues={initialValues}
          //validationSchema={bilbomdJobSchema}
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
            resetForm
          }) => (
            <Form>
              <Grid
                container
                spacing={2}
                direction="column"
              >
                <Grid item>
                  <Field
                    value={values.title || ''}
                    fullWidth
                    id="title"
                    name="title"
                    label="BilboMD Job Title"
                    type="text"
                    disabled={isSubmitting}
                    component={TextField}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.title) && Boolean(touched.title)}
                    helperText={
                      Boolean(errors.title) && Boolean(touched.title)
                        ? errors.title
                        : 'A title for your BilboMD run'
                    }
                  />
                </Grid>

                <Grid
                  item
                  sx={{ mb: 3 }}
                >
                  <FormControl>
                    <FormLabel sx={{ marginBottom: '6px' }}>PDB Files</FormLabel>
                    <MultipleFileUploadField name="pdbs" />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  sx={{ my: 1 }}
                >
                  <Field
                    fullWidth
                    value={values.constinp || ''}
                    id="constinp"
                    name="constinp"
                    component={SimpleFileUpload}
                    label="Upload a const.inp file"
                    variant="outlined"
                    color="secondary"
                  />
                </Grid>

                <Grid
                  item
                  sx={{ my: 1 }}
                >
                  <Field
                    name="expdata"
                    label="Upload your expermental data file"
                    component={SimpleFileUpload}
                    error={Boolean(errors.expdata) && Boolean(touched.expdata)}
                  />
                </Grid>

                <Grid
                  item
                  sx={{ my: 1 }}
                >
                  <Field
                    fullWidth
                    component={Select}
                    formHelperText={{
                      children: 'Extent of Conformational Sampling'
                    }}
                    id="num_conf"
                    name="num_conf"
                    labelId="num_conf"
                    label="Conformations per Rg"
                    displayEmpty
                  >
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={400}>400</MenuItem>
                    <MenuItem value={600}>600</MenuItem>
                    <MenuItem value={800}>800</MenuItem>
                  </Field>
                </Grid>

                <Grid
                  item
                  sx={{ my: 1 }}
                >
                  <Field
                    fullWidth
                    id="rg_min"
                    name="rg_min"
                    label="Rg Min"
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

                <Grid
                  item
                  sx={{ my: 1 }}
                >
                  <Field
                    fullWidth
                    id="rg_max"
                    name="rg_max"
                    label="Rg Max"
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
                <Grid
                  item
                  sx={{ my: 2 }}
                >
                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
                    endIcon={<SendIcon />}
                    loadingPosition="end"
                    variant="contained"
                    size="large"
                  >
                    <span>Submit</span>
                  </LoadingButton>
                </Grid>
              </Grid>
              <Debug />
              {/* <pre>{JSON.stringify({ values, errors }, null, 4)}</pre> */}
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
  return content
}

export default NewJobForm
