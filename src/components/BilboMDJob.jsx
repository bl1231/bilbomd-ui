import { Button, Card, CardContent, Grid, MenuItem, Typography, Chip } from '@mui/material';
import { Form, Formik, Field, FieldArray, useField } from 'formik';
import { TextField, Select } from 'formik-mui';
import UploadField from './UploadField';
//import { useRef } from 'react';
//import { array, object, string } from 'yup';
//import { MultipleFileUploadField } from 'components/Uploads/MultipleFileUploadField';
//import SingleFileUploadWithProgress from 'components/Uploads/SingleFileUploadWithProgress';
import { bilbomdJobSchema } from 'schemas/ValidationSchemas';
import React, { useState, useEffect } from 'react';
//import { FileUpload, FileUploadOutlined } from '@mui/icons-material';
//import CustomFormInputs from './Common/JobFormInputs';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import myFormData from 'form-data';
import axios from 'api/axios';
const axios_upload_url = '/upload';
//const fetch_upload_url = 'http://localhost:3500/upload';
const emptyPDB = { name: '' };

const BilboMDJob = (props) => {
  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={{
            title: '',
            files: [emptyPDB],
            constinp: '',
            expdata: '',
            num_conf: '',
            rg_min: '',
            rg_max: ''
          }}
          validationSchema={bilbomdJobSchema}
          onSubmit={(values) => {
            console.log('BilboMD values:', values);
            //return new Promise((res) => setTimeout(res, 2000));
            const form = new myFormData();
            form.append('title', values.title);
            form.append('num_conf', values.num_conf);
            form.append('rg_min', values.rg_min);
            form.append('rg_max', values.rg_max);
            form.append('expdata', values.expdata);
            form.append('constinp', values.constinp);
            //const b = form.getBoundary();
            // const post_config = {
            //   headers: {
            //     'Content-Type':
            //       'multipart/form-data; boundary=--------------------------515890814546601021194782'
            //   },
            //   withCredentials: true,
            // };
            const upload = async () => {
              const result = await axios
                .post(axios_upload_url, form)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              console.log(result);
            };
            // const upload_using_fetch = async () => {
            //   const result = await fetch(fetch_upload_url, { method: 'POST', body: data });
            // };
            upload();
          }}
        >
          {({ values, errors, isValid, isSubmitting }) => (
            <Form autoComplete="off">
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <Field name="title" component={TextField} label="Job Title" type="text" />
                </Grid>
                <FieldArray name="files">
                  {({ push, remove }) => (
                    <React.Fragment>
                      <Grid item>
                        <Typography variant="body1">All your PDB Files.</Typography>
                      </Grid>
                      {values.files.map((_, index) => (
                        <Grid container item style={{ flexWrap: 'nowrap' }} key={index} spacing={2}>
                          <Grid item container spacing={2} xs={12} sm="auto">
                            <Grid item xs={12} sm="auto">
                              <Button variant="contained" component="label" size="small">
                                Select File
                                <Field name={`files.${index}.name`} type="file" hidden />
                              </Button>
                            </Grid>
                            <Grid item xs={12} sm="auto">
                              <Typography variant="body1">{values.files[index].name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm="auto">
                              <IconButton
                                aria-label="delete"
                                disabled={isSubmitting}
                                onClick={() => remove(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item>
                        <Button
                          disabled={isSubmitting}
                          variant="outlined"
                          size="small"
                          onClick={() => push(emptyPDB)}
                        >
                          Add PDB
                        </Button>
                      </Grid>
                    </React.Fragment>
                  )}
                </FieldArray>
                <Grid item xs={6}>
                  <Typography>const.inp file</Typography>
                  <Button variant="contained" component="label" size="small">
                    Select File
                    <Field name="constinp" type="file" label="const.inp File Upload" hidden />
                  </Button>
                  <Field label={values.constinp} component={Chip}></Field>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Experimental Data</Typography>
                  <Button variant="contained" component="label" size="small">
                    Select File
                    <Field name="expdata" type="file" label="exp data" hidden />
                  </Button>
                  <Field label={values.expdata ? values.expdata : '     '} component={Chip}></Field>
                </Grid>
                <Grid item>
                  <Field
                    component={Select}
                    formHelperText={{ children: 'Extent of Conformational Sampling' }}
                    id="num_conf"
                    name="num_conf"
                    labelId="age-simple"
                    label="Conformations per Rg"
                  >
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={400}>400</MenuItem>
                    <MenuItem value={600}>600</MenuItem>
                    <MenuItem value={800}>800</MenuItem>
                  </Field>
                </Grid>
                <Grid item>
                  <Field
                    component={TextField}
                    name="rg_min"
                    label="Rg Min"
                    type="text"
                    helperText="Min value of Rg ...(between 10 and 100)"
                  />
                </Grid>
                <Grid item>
                  <Field
                    name="rg_max"
                    component={TextField}
                    label="Rg Max"
                    type="text"
                    helperText="Max value of Rg ...(between 10 and 100)"
                  />
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    size="large"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>

              <pre>{JSON.stringify({ values, errors }, null, 2)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default BilboMDJob;
