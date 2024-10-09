import { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
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
import { BilboMDAlphaFoldJobSchema } from 'schemas/BilboMDAlphaFoldJobSchema'
import useAuth from 'hooks/useAuth'
import { Debug } from 'components/Debug'
import LinearProgress from '@mui/material/LinearProgress'
import HeaderBox from 'components/HeaderBox'
import useTitle from 'hooks/useTitle'
import { Entity, NewAlphaFoldJobFormValues } from 'types/alphafoldForm'
import NewAlphaFoldJobFormInstructions from './NewAlphaFoldJobFormInstructions'
import NerscStatusChecker from 'features/nersc/NerscStatusChecker'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

const NewAlphaFoldJob = () => {
  useTitle('BilboMD: New AlphaFold Job')
  const [addNewAlphaFoldJob, { isSuccess }] = useAddNewAlphaFoldJobMutation()
  const { email } = useAuth()
  const [isPerlmutterUnavailable, setIsPerlmutterUnavailable] = useState(false)
  // Fetch the configuration object
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery({})

  if (configIsLoading) return <LinearProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'

  const handleStatusCheck = (isUnavailable: boolean) => {
    // Update the state based on the system's availability
    setIsPerlmutterUnavailable(isUnavailable)
  }
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
    form.append('bilbomd_mode', 'alphafold')
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
  const isFormValid = (values) => {
    return (
      !isPerlmutterUnavailable && values.title !== '' && values.dat_file !== ''
    )
  }
  const content = (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <NewAlphaFoldJobFormInstructions />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HeaderBox>
            <Typography>BilboMD AF Schematic</Typography>
          </HeaderBox>
          <Paper sx={{ p: 2 }}>
            <img
              src='/images/bilbomd-af-schematic.png'
              alt='Overview of BilboMD pipeline'
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Paper>
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
                      {useNersc && (
                        <NerscStatusChecker
                          systemName='perlmutter'
                          onStatusCheck={handleStatusCheck}
                        />
                      )}
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
                                        <MenuItem value='DNA' disabled={true}>
                                          DNA - pending AF3 availability
                                        </MenuItem>
                                        <MenuItem value='RNA' disabled={true}>
                                          RNA - pending AF3 availability
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

                        {/* Conditionally display error messages for alphafold_entities */}
                        {Array.isArray(errors.entities) &&
                        Array.isArray(touched.entities)
                          ? (errors.entities as FormikErrors<Entity>[]).map(
                              (error, idx) =>
                                error && (
                                  <Box key={idx} sx={{ my: 2 }}>
                                    {error.sequence && (
                                      <Alert severity='error'>{`Entity ${idx + 1} sequence: ${error.sequence}`}</Alert>
                                    )}
                                    {error.type && (
                                      <Alert severity='error'>{`Entity ${idx + 1} type: ${error.type}`}</Alert>
                                    )}
                                    {error.copies && (
                                      <Alert severity='error'>{`Entity ${idx + 1} copies: ${error.copies}`}</Alert>
                                    )}
                                  </Box>
                                )
                            )
                          : null}
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
                            !isValid || isSubmitting || !isFormValid(values)
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
