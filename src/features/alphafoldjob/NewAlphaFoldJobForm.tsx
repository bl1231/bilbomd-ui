import {
  Box,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  IconButton,
  Button,
  MenuItem
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'
import { Link as RouterLink } from 'react-router-dom'
import { Form, Formik, Field, FieldArray, FormikErrors } from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewAlphaFoldJobMutation } from 'slices/jobsApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { BilboMDAlphaFoldJobSchema } from 'schemas/BilboMDAlphaFoldJobSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import useTitle from 'hooks/useTitle'
import { Entity, NewAlphaFoldJobFormValues } from 'types/alphafoldForm'

const NewAlphaFoldJob = () => {
  useTitle('BilboMD: New AlphaFold Job')
  const [addNewAlphaFoldJob, { isSuccess }] = useAddNewAlphaFoldJobMutation()
  const { email } = useAuth()

  const initialValues = {
    title: '',
    dat_file: '',
    email: email,
    entities: [
      {
        id: '1',
        name: 'pro-1',
        sequence: '',
        type: 'Protein',
        copies: 1
      }
    ]
  }

  const onSubmit = async (values, { setStatus }) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('dat_file', values.dat_file)
    form.append('email', values.email)
    form.append('bilbomd_mode', 'af')
    values.entities.forEach((entity, index) => {
      form.append(`entities[${index}][id]`, entity.id)
      form.append(`entities[${index}][name]`, entity.name)
      form.append(`entities[${index}][sequence]`, entity.sequence)
      form.append(`entities[${index}][type]`, entity.type)
      form.append(`entities[${index}][copies]`, entity.copies.toString())
    })
    // Log the form data to check if entities are appended
    // for (const pair of form.entries()) {
    //   console.log(`${pair[0]}, ${pair[1]}`)
    // }
    try {
      const newJob = await addNewAlphaFoldJob(form).unwrap()
      setStatus(newJob)
    } catch (error) {
      console.error('rejected', error)
    }
  }

  const content = (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{
                backgroundColor: '#888',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                pl: 1
              }}
            >
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  letterSpacing: '1px'
                }}
              >
                Instructions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography sx={{ m: 1 }}>
                  <b>BilboMD Auto</b> is intended to be run using the outputs
                  from{' '}
                  <Link
                    href='https://deepmind.google/technologies/alphafold/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    AlphaFold2 & AlphaFold-Multimer
                  </Link>
                  . <b>BilboMD Auto</b> uses the{' '}
                  <Link
                    href='https://alphafold.ebi.ac.uk/faq#faq-13'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Predicted Aligned Error
                  </Link>{' '}
                  (PAE) from AlphaFold along with the predicted coordinates (as
                  a PDB file) to automagically generate CHARMM-compatible input
                  files. The <b>*.pdb</b> and PAE <b>*.json</b> files must be
                  the exact ones obtained from AlphaFold since we are also using
                  the{' '}
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
                <ul>
                  <li>
                    <Typography>
                      An AlphaFold PDB <b>*.pdb</b> file (PDB coordinate file.
                      Make sure it matches your PAE file.)
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      An AlphaFold PAE <b>*.json</b> file (The PAE matrix output
                      from AlphaFold in JSON format.)
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      A <b>*.dat</b> file (A 3-column experimental SAXS data
                      file)
                    </Typography>
                  </li>
                </ul>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>BilboMD AF Job Form</Typography>
          </HeaderBox>
          <Paper sx={{ p: 2 }}>
            {isSuccess ? (
              <Alert severity='success'>
                <AlertTitle>Woot!</AlertTitle>
                <Typography>
                  Your job has been submitted. Check out the{' '}
                  <RouterLink to='../jobs'>details</RouterLink>.
                </Typography>
              </Alert>
            ) : (
              <Formik<NewAlphaFoldJobFormValues>
                initialValues={initialValues}
                validationSchema={BilboMDAlphaFoldJobSchema}
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
                  status,
                  setFieldValue,
                  setFieldTouched
                }) => (
                  <Form>
                    <Grid container direction='column'>
                      {/* Title */}
                      <Grid sx={{ my: 2, width: '520px' }}>
                        <Field
                          fullWidth
                          label='Title'
                          name='title'
                          id='title'
                          type='text'
                          disabled={isSubmitting}
                          as={TextField}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.title && touched.title}
                          helperText={
                            errors.title && touched.title ? errors.title : ''
                          }
                          value={values.title || ''}
                        />
                      </Grid>
                      {/* Entities */}
                      <Grid>
                        <FieldArray name='entities'>
                          {({ push, remove }) => {
                            // Helper function to generate name based on type and id
                            const generateName = (type: string, id: string) => {
                              const typePrefix = type
                                .toLowerCase()
                                .substring(0, 3) // Take the first 3 letters of the type
                              return `${typePrefix}-${id}`
                            }
                            // Find the highest current `id` in the entities array
                            const getNextId = () => {
                              const highestId = values.entities.reduce(
                                (maxId, entity) => {
                                  const currentId = parseInt(entity.id, 10) // Ensure it's a number
                                  return currentId > maxId ? currentId : maxId
                                },
                                0
                              )
                              return (highestId + 1).toString() // Increment the highest `id` for the new one
                            }
                            return (
                              <Grid container direction='column'>
                                <Box>
                                  {values.entities.map((entity, index) => (
                                    <Box
                                      key={index}
                                      mb={2}
                                      display='flex'
                                      alignItems='start'
                                    >
                                      {/* Molecule Type */}
                                      <TextField
                                        select
                                        name={`entities.${index}.type`}
                                        label='Molecule Type'
                                        fullWidth
                                        variant='outlined'
                                        value={entity.type || 'Protein'}
                                        onChange={(e) => {
                                          handleChange(e)
                                          // Update the name based on type and id whenever the type changes
                                          const newName = generateName(
                                            e.target.value,
                                            entity.id
                                          )
                                          setFieldValue(
                                            `entities.${index}.name`,
                                            newName
                                          )
                                        }}
                                        error={
                                          touched.entities &&
                                          touched.entities[index] &&
                                          Boolean(
                                            errors.entities &&
                                              (
                                                errors.entities as FormikErrors<Entity>[]
                                              )[index]?.type
                                          )
                                        }
                                        sx={{
                                          width: '200px',
                                          marginRight: 2
                                        }}
                                        slotProps={{
                                          input: { style: { height: '54px' } }
                                        }}
                                      >
                                        <MenuItem value='Protein'>
                                          Protein
                                        </MenuItem>
                                        <MenuItem value='DNA' disabled={false}>
                                          DNA
                                        </MenuItem>
                                        <MenuItem value='RNA' disabled={true}>
                                          RNA
                                        </MenuItem>
                                      </TextField>

                                      {/* Copies Field */}
                                      <Field
                                        as={TextField}
                                        name={`entities.${index}.copies`}
                                        label='Copies'
                                        type='number'
                                        InputProps={{
                                          inputProps: { min: 1, step: 1 },
                                          sx: { height: '100%' } // Ensure full height usage
                                        }}
                                        fullWidth
                                        variant='outlined'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={
                                          values.entities[index].copies || 1
                                        }
                                        error={
                                          touched.entities &&
                                          touched.entities[index] &&
                                          Boolean(
                                            errors.entities &&
                                              (
                                                errors.entities as FormikErrors<Entity>[]
                                              )[index]?.copies
                                          )
                                        }
                                        sx={{
                                          width: '100px',
                                          marginRight: 2,
                                          height: '54px'
                                        }} // Fixed height
                                      />

                                      {/* Sequence */}
                                      <Field
                                        as={TextField}
                                        name={`entities.${index}.sequence`}
                                        label='Amino Acid Sequence'
                                        fullWidth
                                        multiline
                                        variant='outlined'
                                        minRows={1}
                                        // InputProps={{
                                        //   sx: { height: '50px' }
                                        // }}
                                        value={
                                          values.entities[index].sequence || ''
                                        }
                                        error={
                                          touched.entities &&
                                          touched.entities[index] &&
                                          Boolean(
                                            errors.entities &&
                                              (
                                                errors.entities as FormikErrors<Entity>[]
                                              )[index]?.sequence
                                          )
                                        }
                                        sx={{
                                          width: '100%',
                                          marginRight: 2
                                        }}
                                        InputLabelProps={{
                                          shrink: true // Ensures the label is displayed properly with outlined variant
                                        }}
                                      />

                                      <IconButton
                                        onClick={() => {
                                          if (values.entities.length === 1) {
                                            // If there's only one entity, reset it with a new blank entity
                                            remove(index)
                                            push({
                                              id: `${index + 1}`,
                                              name: generateName(
                                                'Protein',
                                                `${index + 1}`
                                              ),
                                              sequence: '',
                                              type: 'Protein',
                                              copies: 1
                                            })
                                          } else {
                                            // Remove the entity as usual
                                            remove(index)
                                          }
                                        }}
                                        sx={{ marginLeft: 1 }}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Box>
                                  ))}
                                  <Button
                                    variant='contained'
                                    color='primary'
                                    startIcon={<Add />}
                                    onClick={() =>
                                      push({
                                        id: getNextId(),
                                        name: generateName(
                                          'Protein',
                                          getNextId()
                                        ),
                                        sequence: '',
                                        type: 'Protein',
                                        copies: 1
                                      })
                                    }
                                  >
                                    Add Entity
                                  </Button>
                                </Box>
                              </Grid>
                            )
                          }}
                        </FieldArray>
                      </Grid>
                      {/* SAXS dat file */}
                      <Grid>
                        <Field
                          name='dat_file'
                          id='dat-file-upload'
                          as={FileSelect}
                          title='Select File'
                          disabled={isSubmitting}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.dat_file && touched.dat_file}
                          errorMessage={errors.dat_file ? errors.dat_file : ''}
                          fileType='experimental SAXS data *.dat'
                          fileExt='.dat'
                        />
                      </Grid>
                      {/* Progress Bar */}
                      {isSubmitting && (
                        <Box sx={{ my: 1, width: '520px' }}>
                          <LinearProgress />
                        </Box>
                      )}
                      {/* Submit Button */}
                      <Grid sx={{ mt: 2 }}>
                        <LoadingButton
                          type='submit'
                          disabled={
                            !isValid ||
                            values.title === '' ||
                            values.dat_file === ''
                          }
                          loading={isSubmitting}
                          endIcon={<SendIcon />}
                          loadingPosition='end'
                          variant='contained'
                          sx={{ width: '110px' }}
                        >
                          <span>Submit</span>
                        </LoadingButton>

                        {isSuccess ? (
                          <Alert severity='success'>{status}</Alert>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </Grid>
                    {process.env.NODE_ENV === 'development' ? <Debug /> : ''}
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

export default NewAlphaFoldJob
