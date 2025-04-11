import { ChangeEvent, FocusEvent, useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  IconButton,
  Button,
  MenuItem,
  Link
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import Grid from '@mui/material/Grid'
import { Link as RouterLink } from 'react-router'
import {
  Form,
  Formik,
  Field,
  FieldArray,
  FormikErrors,
  FormikTouched
} from 'formik'
import FileSelect from 'features/jobs/FileSelect'
import { useAddNewAlphaFoldJobMutation } from 'slices/jobsApiSlice'
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
import { useTheme } from '@mui/material/styles'

// --------------------------------------------------------------------
// Helpers for <sup> chunking
// --------------------------------------------------------------------
function chunkSequenceHTML(seq: string): string {
  if (!seq) return ''
  const chunkSize = 10
  let out = ''
  let i = 0

  while (i < seq.length) {
    const end = Math.min(i + chunkSize, seq.length)
    const chunk = seq.slice(i, end)
    // Insert chunk + real <sup> tag
    out += `${chunk}<sup>${end}</sup>`
    // Add a space if not at the end
    if (end < seq.length) {
      out += ' '
    }
    i = end
  }
  return out
}

// --------------------------------------------------------------------
// Single-Textbox AminoAcidField
//  - On focus: shows raw text for editing
//  - On blur: shows HTML-chunked <sup> preview
// --------------------------------------------------------------------
function AminoAcidField(props: {
  label: string
  name: string
  rawValue: string
  touched?: boolean
  error?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
}) {
  const { label, name, rawValue, touched, error, onChange, onBlur, disabled } =
    props

  // Track focus state
  const [isFocused, setIsFocused] = useState(false)
  // Local display value
  const [displayValue, setDisplayValue] = useState(rawValue)

  // Sync rawValue if it changes from outside
  useEffect(() => {
    setDisplayValue(rawValue)
  }, [rawValue])

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur(e) // Let Formik know about blur
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value)
    onChange(e) // Pass raw text to Formik
  }

  // If focused, show editable text field; otherwise, show HTML preview
  if (isFocused) {
    return (
      <Box sx={{ width: '100%' }}>
        <TextField
          fullWidth
          multiline
          variant='outlined'
          label={label}
          name={name}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          error={Boolean(error && touched)}
          helperText={error && touched ? error : ''}
          sx={{
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            letterSpacing: '0.15em'
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </Box>
    )
  } else {
    // Show chunked HTML with <sup>
    const chunkedHTML = chunkSequenceHTML(displayValue)

    return (
      <Box sx={{ width: '100%' }}>
        {/* "Read-only" box, but clickable/focusable to edit */}
        <Box
          tabIndex={0}
          onFocus={handleFocus}
          onClick={() => setIsFocused(true)}
          sx={{
            minHeight: '56px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            p: 1,
            cursor: 'text',
            // Use a consistent font for better alignment
            fontFamily: '"Roboto", "Noto Sans", sans-serif',
            whiteSpace: 'pre-wrap',
            letterSpacing: '0.05em',
            fontSize: '1rem',
            color: 'text.primary'
          }}
          dangerouslySetInnerHTML={{ __html: chunkedHTML }}
        />
        {/* Show error below if needed */}
        {error && touched && (
          <Typography variant='body2' color='error' sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        )}
      </Box>
    )
  }
}

const Instructions = () => (
  <Grid size={{ xs: 12 }}>
    <NewAlphaFoldJobFormInstructions />
  </Grid>
)

const PipelineSchematic = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Grid size={{ xs: 12 }}>
    <HeaderBox>
      <Typography>BilboMD AF Schematic</Typography>
    </HeaderBox>
    <Paper sx={{ p: 2 }}>
      <img
        src={
          isDarkMode
            ? '/images/bilbomd-af-schematic-dark.png'
            : '/images/bilbomd-af-schematic.png'
        }
        alt='Overview of BilboMD AF pipeline'
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Paper>
  </Grid>
)

const EntitiesFieldArray = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue
}: {
  values: NewAlphaFoldJobFormValues
  errors: FormikErrors<NewAlphaFoldJobFormValues>
  touched: FormikTouched<NewAlphaFoldJobFormValues>
  handleBlur: (e: FocusEvent<Element>) => void
  handleChange: (e: ChangeEvent<Element>) => void
  setFieldValue: (
    field: string,
    value: string | number,
    shouldValidate?: boolean
  ) => void
}) => {
  return (
    <FieldArray name='entities'>
      {({ push, remove }) => {
        // Helper to generate name based on type + id
        const generateName = (type: string, id: string) => {
          const typePrefix = type.toLowerCase().substring(0, 3)
          return `${typePrefix}-${id}`
        }

        // Find the highest current `id` in the entities array
        const getNextId = () => {
          const highestId = values.entities.reduce((maxId, entity) => {
            const currentId = parseInt(entity.id, 10)
            return currentId > maxId ? currentId : maxId
          }, 0)
          return (highestId + 1).toString()
        }

        const totalCharactersWithCopies = values.entities.reduce(
          (acc, entity) =>
            acc + (entity.sequence?.length || 0) * (entity.copies || 1),
          0
        )

        return (
          <Grid container direction='column'>
            <Box>
              {values.entities.map((entity, index) => {
                const seqError =
                  errors.entities &&
                  errors.entities[index] &&
                  typeof errors.entities[index] !== 'string' &&
                  (errors.entities[index] as FormikErrors<Entity>).sequence
                const seqTouched =
                  touched.entities &&
                  touched.entities[index] &&
                  typeof touched.entities[index] !== 'string' &&
                  (touched.entities[index] as FormikTouched<Entity>).sequence

                return (
                  <Box key={index} mb={2} display='flex' alignItems='start'>
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
                        const newName = generateName(e.target.value, entity.id)
                        setFieldValue(`entities.${index}.name`, newName)
                      }}
                      sx={{
                        width: '200px',
                        marginRight: 2,
                        '& .MuiInputBase-root': {
                          height: '54px',
                          alignItems: 'center'
                        }
                      }}
                    >
                      <MenuItem value='Protein'>Protein</MenuItem>
                      <MenuItem value='DNA' disabled>
                        DNA - pending AF3 availability
                      </MenuItem>
                      <MenuItem value='RNA' disabled>
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
                      value={entity.copies || 1}
                      sx={{ width: '100px', marginRight: 2, height: '54px' }}
                    />

                    {/* AminoAcidField */}
                    <Box flex={1} marginRight={2}>
                      <AminoAcidField
                        label={`Amino Acid Sequence (${
                          entity.sequence?.length || 0
                        })`}
                        name={`entities.${index}.sequence`}
                        rawValue={entity.sequence || ''}
                        error={seqError as string}
                        touched={Boolean(seqTouched)}
                        // Pass the raw value to Formik
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newSeq = e.target.value
                          setFieldValue(`entities.${index}.sequence`, newSeq)
                          // Also update seq_length
                          setFieldValue(
                            `entities.${index}.seq_length`,
                            newSeq.length
                          )
                        }}
                        onBlur={handleBlur}
                      />
                    </Box>

                    <IconButton
                      onClick={() => {
                        if (values.entities.length === 1) {
                          // If there's only one entity, reset it with a new blank entity
                          remove(index)
                          push({
                            id: `${index + 1}`,
                            name: generateName('Protein', `${index + 1}`),
                            sequence: '',
                            type: 'Protein',
                            copies: 1,
                            seq_length: 0
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
                )
              })}
              <p> Total characters {totalCharactersWithCopies}</p>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Add />}
                onClick={() =>
                  push({
                    id: getNextId(),
                    name: generateName('Protein', getNextId()),
                    sequence: '',
                    type: 'Protein',
                    copies: 1,
                    seq_length: 0
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
  )
}

const SubmitButton = ({
  isSubmitting,
  isValid,
  isFormValid,
  status
}: {
  isSubmitting: boolean
  isValid: boolean
  isFormValid: boolean
  status: string | undefined
}) => (
  <Grid sx={{ mt: 2 }}>
    <Button
      type='submit'
      disabled={!isValid || isSubmitting || !isFormValid}
      loading={isSubmitting}
      endIcon={<SendIcon />}
      loadingPosition='end'
      variant='contained'
      sx={{ width: '110px' }}
    >
      <span>Submit</span>
    </Button>
    {status && <Alert severity='success'>{status}</Alert>}
  </Grid>
)

const NewAlphaFoldJob = () => {
  useTitle('BilboMD: New AlphaFold Job')
  const [addNewAlphaFoldJob, { isSuccess }] = useAddNewAlphaFoldJobMutation()
  const { email } = useAuth()
  const [isPerlmutterUnavailable, setIsPerlmutterUnavailable] = useState(false)

  // Fetch configuration object
  const {
    data: config,
    error: configError,
    isLoading: configIsLoading
  } = useGetConfigsQuery('configData')

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  if (configIsLoading) return <LinearProgress />
  if (configError)
    return <Alert severity='error'>Error loading configuration</Alert>

  const useNersc = config.useNersc?.toLowerCase() === 'true'

  const handleStatusCheck = (isUnavailable: boolean) => {
    // Update the state based on the system's availability
    setIsPerlmutterUnavailable(isUnavailable)
  }

  const initialValues: NewAlphaFoldJobFormValues = {
    title: '',
    dat_file: '',
    email: email,
    entities: [
      {
        id: '1',
        name: 'pro-1',
        sequence: '',
        type: 'Protein',
        copies: 1,
        seq_length: 0
      }
    ]
  }

  const onSubmit = async (
    values: NewAlphaFoldJobFormValues,
    { setStatus }: { setStatus: (status: string) => void }
  ) => {
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
    try {
      const newJob = await addNewAlphaFoldJob(form).unwrap()
      // setStatus(newJob)
      // ✅ Set only a string value
      setStatus(`Job Submitted: ${newJob.jobid}`)
    } catch (error) {
      console.error('rejected', error)
      setTimeout(() => {
        throw error
      })
    }
  }

  const isFormValid = (values: NewAlphaFoldJobFormValues) => {
    return (
      !isPerlmutterUnavailable && values.title !== '' && values.dat_file !== ''
    )
  }

  const content = (
    <Grid container spacing={2}>
      <Instructions />
      <PipelineSchematic isDarkMode={isDarkMode} />
      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Typography>BilboMD AF Job Form</Typography>
        </HeaderBox>
        <Paper sx={{ p: 2 }}>
          {!useNersc ? (
            <Alert severity='warning'>
              If you would like to run <b>BilboMD AF</b> which requires GPU
              compute capabilities, please head over to BilboMD running on{' '}
              <b>NERSC</b>:{' '}
              <Link
                href='https://bilbomd-nersc.bl1231.als.lbl.gov'
                target='_blank'
                rel='noopener noreferrer'
              >
                <b>bilbomd-nersc.bl1231.als.lbl.gov</b>.
              </Link>
            </Alert>
          ) : isSuccess ? (
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
                      <EntitiesFieldArray
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                      />

                      {/* Conditionally display error messages for alphafold_entities */}
                      {Array.isArray(errors.entities) &&
                      Array.isArray(touched.entities)
                        ? (errors.entities as FormikErrors<Entity>[]).map(
                            (error, idx) =>
                              error && (
                                <Box key={idx} sx={{ my: 2 }}>
                                  {error.sequence && (
                                    <Alert severity='error'>{`Entity ${
                                      idx + 1
                                    } sequence: ${error.sequence}`}</Alert>
                                  )}
                                  {error.type && (
                                    <Alert severity='error'>{`Entity ${
                                      idx + 1
                                    } type: ${error.type}`}</Alert>
                                  )}
                                  {error.copies && (
                                    <Alert severity='error'>{`Entity ${
                                      idx + 1
                                    } copies: ${error.copies}`}</Alert>
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
                    <SubmitButton
                      isSubmitting={isSubmitting}
                      isValid={isValid}
                      isFormValid={isFormValid(values)}
                      status={status}
                    />
                  </Grid>
                  {process.env.NODE_ENV === 'development' ? <Debug /> : ''}
                </Form>
              )}
            </Formik>
          )}
        </Paper>
      </Grid>
    </Grid>
  )

  return content
}

export default NewAlphaFoldJob
