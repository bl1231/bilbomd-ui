import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Chip
} from '@mui/material';
import { Form, Formik, Field } from 'formik';
import { Select, SimpleFileUpload } from 'formik-mui';
import { MultipleFileUploadField } from './MultipleFileUploadField';
import { Debug } from 'components/Debug';
import { bilbomdJobSchema } from '../../schemas/ValidationSchemas';
import axios from 'api/axios';
const axios_upload_url = '/upload';
const initialValues = {
  title: '',
  pdbs: [],
  constinp: '',
  expdata: '',
  num_conf: '200',
  rg_min: '',
  rg_max: ''
};

const NewUpload2 = () => {
  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={bilbomdJobSchema}
          onSubmit={(values, { resetForm }) => {
            console.log('values', values);
            //return new Promise((res) => setTimeout(res, 2000));
            const form = new FormData();
            form.append('title', values.title);
            form.append('num_conf', values.num_conf);
            form.append('rg_min', values.rg_min);
            form.append('rg_max', values.rg_max);
            form.append('expdata', values.expdata);
            form.append('constinp', values.constinp);
            const upload = async () => {
              const result = await axios
                .post(axios_upload_url, form)
                .then((res) => {
                  console.log(res);
                  resetForm();
                })
                .catch((err) => console.log(err));
              console.log(result);
            };
            upload();
          }}
        >
          {({ values, errors, touched, isValid, isSubmitting, handleChange, handleBlur }) => (
            <Form>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <Field
                    id="title"
                    name="title"
                    label="Title"
                    type="text"
                    component={TextField}
                    helperText="title for your job"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.title && touched.title}
                  />
                </Grid>

                <MultipleFileUploadField name="pdbs" />

                <Grid item>
                  <Field
                    id="constinp"
                    name="constinp"
                    component={SimpleFileUpload}
                    label="Const.inp"
                  />
                </Grid>

                <Grid item>
                  <Field
                    id="expdata"
                    name="expdata"
                    component={SimpleFileUpload}
                    label="Experimental data"
                  />
                </Grid>

                <Grid item>
                  <Field
                    component={Select}
                    formHelperText={{ children: 'Extent of Conformational Sampling' }}
                    id="num_conf"
                    name="num_conf"
                    labelId="num_conf"
                    label="Conformations per Rg"
                    displayEmpty
                  >
                    <MenuItem disabled value="">
                      <em>Placeholder</em>
                    </MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={400}>400</MenuItem>
                    <MenuItem value={600}>600</MenuItem>
                    <MenuItem value={800}>800</MenuItem>
                  </Field>
                </Grid>
                <Grid item>
                  <Field
                    id="rg_min"
                    name="rg_min"
                    label="Rg Min"
                    type="text"
                    component={TextField}
                    helperText="Min value of Rg ...(between 10 and 100)"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.rg_min && touched.rg_min}
                  />
                </Grid>
                <Grid item>
                  <Field
                    id="rg_max"
                    name="rg_max"
                    label="Rg Max"
                    type="text"
                    component={TextField}
                    helperText="Max value of Rg ...(between 10 and 100)"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.rg_max && touched.rg_max}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isValid || isSubmitting}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
              <Debug />
              {/* <pre>{JSON.stringify({ values, errors }, null, 4)}</pre> */}
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default NewUpload2;
