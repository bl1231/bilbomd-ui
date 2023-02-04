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
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import { Form, Formik, Field } from 'formik'
import { Select, SimpleFileUpload } from 'formik-mui'
import { MultipleFileUploadField } from './MultipleFileUploadField'
import { Debug } from 'components/Debug'
import { bilbomdJobSchema } from 'schemas/ValidationSchemas'
import { useNavigate } from 'react-router-dom'
import axios from 'app/api/axios'

const axios_upload_url = '/upload'

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
  rg_max: ''
}

export interface BilboMDUploadForm {
  title: string;
  pdbs: [
    {
      file: {
        path: ''
      },
      errors: [],
      id: '',
      uuid: ''
    }
  ];
  constinp: File;
  expdata: File;
  num_conf: number;
  rg_min: number;
  rg_max: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const onSubmit = async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
  console.log('form values: ', values)
  await sleep(2000)
  const form = new FormData()
  form.append('title', values.title)
  //console.log('have this many PDBs: ', values.pdbs.length);
  values.pdbs.forEach((pdb, index) => {
    //console.log(pdb.uuid);
    form.append(`pdb_${index + 1}`, pdb.file)
  })
  form.append('num_conf', values.num_conf)
  form.append('rg_min', values.rg_min)
  form.append('rg_max', values.rg_max)
  form.append('expdata', values.expdata)
  form.append('constinp', values.constinp)

  //console.log(form);

  const upload = async () => {
    const result = await axios
      .post(axios_upload_url, form)
      .then((res) => {
        console.log(res)
        resetForm({})
        setStatus({ success: true })
      })
      .catch((error) => {
        console.log(error)
        setStatus({ success: false })
        setSubmitting(false)
      })
    console.log('result: ', result)
  }
  upload()
}

const NewBilboMDJob = () => {
  const history = useNavigate()
  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={initialValues}
          //validationSchema={bilbomdJobSchema}
          onSubmit={async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
            console.log('form values: ', values)
            await sleep(500)
            const form = new FormData()
            form.append('title', values.title)
            //console.log('have this many PDBs: ', values.pdbs.length);
            values.pdbs.forEach((pdb, index) => {
              //console.log(pdb.uuid);
              form.append(`pdb_${index + 1}`, pdb.file)
            })
            form.append('num_conf', values.num_conf)
            form.append('rg_min', values.rg_min)
            form.append('rg_max', values.rg_max)
            form.append('expdata', values.expdata)
            form.append('constinp', values.constinp)

            const upload = async () => {
              const result = await axios
                .post(axios_upload_url, form, {
                  withCredentials: true
                })
                .then((res) => {
                  console.log(res)
                  resetForm({})
                  setStatus({ success: true })
                })
                .then(() => history('/dashboard/jobs'))
                .catch((error) => {
                  console.log(error)
                  setStatus({ success: false })
                  setSubmitting(false)
                })
              console.log('result: ', result)
            }
            upload()
          }}
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
                  {/* <Typography
                    variant="caption"
                    display="block"
                    sx={{ color: 'red' }}
                  >
                    {errors.constinp ? `${errors.constinp}` : ''}
                  </Typography> */}
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
                  {/* <Typography
                    variant="caption"
                    display="block"
                    sx={{ color: 'red' }}
                  >
                    {errors.expdata ? `${errors.expdata}` : ''}
                  </Typography> */}
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
}

export default NewBilboMDJob
