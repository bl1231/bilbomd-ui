import React from 'react'
import { useFormikContext } from 'formik'
import { Typography, Grid } from '@mui/material'

import formModel from '../FormModel/formModel'
import { UploadField } from '../FormFields/UploadField'
// import ReportField from '../Helper/ReportField'

const DomainForm = () => {
  const { formField } = formModel
  const { values: formValues } = useFormikContext()

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Check the values inside the `console`
      </Typography>
      <Grid container spacing={2}>
        {/* <ReportField formValues={formValues} formData={formField} /> */}
      </Grid>
    </React.Fragment>
  )
}

export default DomainForm
