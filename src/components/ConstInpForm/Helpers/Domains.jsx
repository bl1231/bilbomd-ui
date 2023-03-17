import React from 'react'
import { Formik, Form, Field, useFormikContext } from 'formik'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  AlertTitle,
  Link,
  Button,
  Chip
} from '@mui/material'
import { Box } from '@mui/system'

const Domains = ({ chainIndex, domainsArrayHelpers }) => {
  const [id, setId] = React.useState('')
  const [start, setStart] = React.useState('')
  const [end, setEnd] = React.useState('')
  const { values } = useFormikContext()

  const handleAddContactNumber = () => {
    const domain = {}
    domain.id = id
    domain.start = start
    domain.end = end
    domainsArrayHelpers.push(domain)
    setId('')
    setStart('')
    setEnd('')
  }

  const handleChangeId = (event) => {
    setId(event.currentTarget.value)
  }
  const handleChangeStart = (event) => {
    setStart(event.currentTarget.value)
  }
  const handleChangeEnd = (event) => {
    setEnd(event.currentTarget.value)
  }

  return (
    <Grid container direction="column" sx={{ my: 1, backgroundColor: '#f4ffb8' }}>
      <Grid item sx={{ flex: '0 1 auto' }}>
        {values.crdFile.chains[chainIndex].domains.map((domain, index) => (
          <Grid
            item
            key={domain.id + index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              p: 1,
              backgroundColor: '#eaff8f'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography
                variant="h5"
                sx={{ display: 'flex', flex: '0 1 auto', alignItems: 'center', mr: 2 }}
              >
                domain {index + 1}:
              </Typography>
              <Chip label={`${domain.start} - ${domain.end}`} />
            </Box>

            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              type="button"
              variant="contained"
              size="small"
              color="error"
              onClick={() => domainsArrayHelpers.remove(index)}
            >
              Delete
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid item sx={{ flex: '0 1 auto' }}>
        <Field
          label="Start"
          id="start"
          name="start"
          type="text"
          // disabled={isSubmitting}
          as={TextField}
          // error={errors.rg_max && touched.rg_max}
          // helperText={
          //   errors.rg_max && touched.rg_max
          //     ? errors.rg_max
          //     : 'Max value of Rg ...(between 10 and 100)'
          // }
          onChange={handleChangeStart}
          // onBlur={handleBlur}
        />
        {/* <input type="text" value={end} onChange={handleChangeEnd} /> */}
        <Field
          label="End"
          id="end"
          name="end"
          type="text"
          as={TextField}
          onChange={handleChangeEnd}
        />
        <Button type="button" variant="contained" onClick={handleAddContactNumber}>
          add rigid domain to {values.crdFile.chains[chainIndex].id}
        </Button>
      </Grid>
    </Grid>
  )
}

export default Domains
