import { Button, Card, CardContent, CircularProgress, Grid } from '@mui/material';
import { TextField } from 'formik-mui';
import { Field, FieldArray, Form, Formik } from 'formik';
//import { CheckboxWithLabel, TextField } from 'formik-material-ui';

import { bilbomdJobSchema } from 'schemas/ValidationSchemas';
import React from 'react';

const emptyPDB = { pdb: '' };
// const useStyles = styled((theme) => ({
//     errorColor: {
//         color: theme.palette.error.main
//     },
//     noWrap: {
//         [theme.breakpoints.up('sm')]: {
//             flexWrap: 'nowrap'
//         }
//     }
// }));

const AddBilboMDJob = () => {
  //const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={{ title: '', pdbs: [emptyPDB] }}
          validationSchema={bilbomdJobSchema}
          onSubmit={async (values) => {
            console.log('my values', values);
            return new Promise((res) => setTimeout(res, 2500));
          }}
        >
          {({ values, errors, isSubmitting }) => (
            <Form autoComplete="off">
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Field
                    fullWidth
                    name="title"
                    component={TextField}
                    label="Job Title"
                    type="text"
                  />
                </Grid>
                <FieldArray name="pdbs">
                  {({ push, remove }) => (
                    <React.Fragment>
                      <Grid item>All your PDBs</Grid>

                      {values.pdbs.map((_, index) => (
                        <Grid container item key={index} spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              fullWidth
                              name={`pdbs[${index}].pdb`}
                              component={TextField}
                              type="file"
                              accept=".pdb"
                            />
                          </Grid>

                          <Grid item xs={12} sm="auto">
                            <Button onClick={() => remove(index)}>Delete</Button>
                          </Grid>
                        </Grid>
                      ))}

                      <Grid item>
                        <Button
                          disabled={isSubmitting}
                          variant="contained"
                          onClick={() => push(emptyPDB)}
                        >
                          Add PDB
                        </Button>
                      </Grid>
                    </React.Fragment>
                  )}
                </FieldArray>
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                  >
                    {isSubmitting ? 'Submitting' : 'Submit'}
                  </Button>
                </Grid>
              </Grid>

              <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default AddBilboMDJob;
