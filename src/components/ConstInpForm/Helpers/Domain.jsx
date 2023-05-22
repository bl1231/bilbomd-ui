import React, { useEffect, useRef } from 'react'
import { useField, Field, useFormikContext, ErrorMessage } from 'formik'
import { Grid, TextField, Typography, Chip, Alert, MenuItem } from '@mui/material'

import { Box } from '@mui/system'

const Domain = ({
  rigidBodyIndex: rbidx,
  domain,
  domainIndex: didx,
  domainArrayHelpers
}) => {
  const [field, meta, helper] = useField('crd_file')
  const { touched, error } = meta
  const { value } = field
  const { values, handleChange, handleBlur, errors, isValid } = useFormikContext()
  // console.log(rigidBodyIndex, domain, domainIndex, domainArrayHelpers)
  // console.log(rigidBodyIndex)

  const effectRan = useRef(false)

  // useEffect(() => {
  //   if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
  //     // not exactly sure of best place for this.
  //     // Need to update parent of isValid so we can enable/disable the "NEXT" button
  //     console.log('valid:', isValid)
  //     // setStepIsValid(isValid)
  //     //   console.log(JSON.stringify(values, null, 2))
  //   }
  //   return () => {
  //     effectRan.current = true
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isValid])

  let content = (
    <React.Fragment key={didx}>
      <Grid item>
        <Grid
          item
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: '0 3 auto',

            p: 1,
            m: 1
            // backgroundColor: '#eaff8f' // for layout debugging
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <TextField
              label="Chain"
              variant="outlined"
              id="chainid"
              name={`crd_file.rigid_bodies[${rbidx}].domains[${didx}].chainid`}
              select
              defaultValue={
                values.crd_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  ? values.crd_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  : ''
              }
              value={
                values.crd_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  ? values.crd_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  : ''
              }
              sx={{ flex: '0 0 auto' }}
              FormHelperTextProps={
                errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  ? {
                      style: { backgroundColor: 'transparent' }
                    }
                  : {
                      style: { backgroundColor: 'transparent', color: 'black' }
                    }
              }
              InputLabelProps={{
                style: { backgroundColor: 'transparent' }
              }}
              // color="warning"
              onChange={handleChange}
              onBlur={handleBlur}
              // error={errors.chainid}
              error={Boolean(
                errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.chainid
              )}
              // helperText={errors.chainid && touched.chainid ? errors.chainid : 'Chain ID'}
              helperText="Chain ID"
            >
              {values.crd_file.chains.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.id}
                </MenuItem>
              ))}
            </TextField>

            <Field
              label="Start"
              id="start"
              name={`crd_file.rigid_bodies[${rbidx}].domains[${didx}].start`}
              type="text"
              as={TextField}
              helperText="Starting residue"
              FormHelperTextProps={
                errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.start
                  ? {
                      style: { backgroundColor: 'transparent' }
                    }
                  : {
                      style: { backgroundColor: 'transparent', color: 'black' }
                    }
              }
              InputLabelProps={{
                style: { backgroundColor: 'transparent' }
              }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.start)}
              sx={{ mx: 1 }}
            />

            <Field
              label="End"
              id="end"
              name={`crd_file.rigid_bodies[${rbidx}].domains[${didx}].end`}
              type="text"
              as={TextField}
              helperText="Ending residue"
              FormHelperTextProps={
                errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.end
                  ? {
                      style: { backgroundColor: 'transparent' }
                    }
                  : {
                      style: { backgroundColor: 'transparent', color: 'black' }
                    }
              }
              InputLabelProps={{
                style: { backgroundColor: 'transparent' }
              }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.end)}
              sx={{ mx: 1 }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                border: 1,
                borderColor: 'grey.400',
                backgroundColor: '#f6ffed',
                borderRadius: 2,
                ml: 1,
                px: 1,
                py: 3
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  // display: 'flex',
                  // flex: '0 1 auto',
                  // alignItems: 'flex-start',
                  mx: 2
                }}
              >
                {domain.chainid} rigid{didx + 1}:
              </Typography>
              <Chip
                label={`${domain.start} - ${domain.end}`}
                variant="outlined"
                sx={{ backgroundColor: '#a0d919' }}
              />
            </Box>
          </Box>
        </Grid>
        {/* ERROR GRID CODE HERE */}
        <Grid item sx={{ flex: '0 1 auto', mb: 1 }}>
          {errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.chainid ? (
            <ErrorMessage
              component={Alert}
              severity="error"
              name={`crd_file.rigid_bodies[${rbidx}].domains[${didx}].chainid`}
            ></ErrorMessage>
          ) : (
            ''
          )}
          {errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.start ? (
            <ErrorMessage
              component={Alert}
              severity="error"
              name={`crd_file.rigid_bodies[${rbidx}].domains[${didx}].start`}
            ></ErrorMessage>
          ) : (
            ''
          )}
          {errors.crd_file?.rigid_bodies[rbidx]?.domains[didx]?.end ? (
            <ErrorMessage
              component={Alert}
              severity="error"
              name={`crd_file.rigid_bodies[${rbidx}].domains[${didx}].end`}
            ></ErrorMessage>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  )
  return content
}

export default Domain
