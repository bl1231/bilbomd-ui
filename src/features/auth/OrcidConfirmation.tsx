import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from '@mui/material'
import {
  useGetOrcidSessionQuery,
  useFinalizeOrcidMutation
} from '../../slices/authApiSlice'

interface OrcidProfile {
  givenName: string
  familyName: string
  email: string
  orcidId: string
}

const validationSchema = Yup.object().shape({
  givenName: Yup.string().required('First name is required'),
  familyName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  orcidId: Yup.string().required('ORCID iD is required')
})

export default function OrcidConfirmation() {
  const { data: profile, isLoading, isError } = useGetOrcidSessionQuery({})
  const [finalizeOrcid] = useFinalizeOrcidMutation()

  const formik = useFormik({
    initialValues: profile || {
      givenName: '',
      familyName: '',
      email: '',
      orcidId: ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values: OrcidProfile) => {
      try {
        await finalizeOrcid(values).unwrap()
        window.location.href = '/welcome'
      } catch (err) {
        console.error(err)
        window.location.href = '/auth/orcid-error?reason=finalize'
      }
    }
  })

  if (isLoading) return <Typography>Loading...</Typography>
  if (isError || !profile) {
    window.location.href = '/auth/orcid-error?reason=session'
    return null
  }

  return (
    <Container maxWidth='sm'>
      <Paper sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant='h5' gutterBottom>
          Confirm ORCID Profile
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box display='flex' flexDirection='column' gap={2}>
            <TextField
              label='First Name'
              name='givenName'
              value={formik.values.givenName}
              onChange={formik.handleChange}
              error={
                formik.touched.givenName && Boolean(formik.errors.givenName)
              }
              helperText={formik.touched.givenName && formik.errors.givenName}
              slotProps={{ input: { readOnly: true } }}
              fullWidth
            />

            <TextField
              label='Last Name'
              name='familyName'
              value={formik.values.familyName}
              onChange={formik.handleChange}
              error={
                formik.touched.familyName && Boolean(formik.errors.familyName)
              }
              helperText={formik.touched.familyName && formik.errors.familyName}
              slotProps={{ input: { readOnly: true } }}
              fullWidth
            />

            <TextField
              label='Email'
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              slotProps={{ input: { readOnly: true } }}
              fullWidth
            />

            <TextField
              label='ORCID iD'
              name='orcidId'
              value={formik.values.orcidId}
              slotProps={{ input: { readOnly: true } }}
              fullWidth
            />

            <Button type='submit' variant='contained' color='primary'>
              Confirm and Continue
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}
