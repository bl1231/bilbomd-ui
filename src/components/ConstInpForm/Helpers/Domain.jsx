import React, { useState, useEffect, useRef } from 'react'
import { useField, Field, useFormikContext, FieldArray, ErrorMessage } from 'formik'
import { Grid, TextField, Typography, Button, Chip, Alert, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/system'

const Domain = ({ rigidBodyIndex, domain, domainIndex, domainArrayHelpers }) => {
  const [field, meta, helper] = useField('crd_file')
  const { touched, error } = meta
  const { value } = field
  const { values, handleChange, handleBlur, errors, isValid } = useFormikContext()
  // console.log(rigidBodyIndex, domain, domainIndex, domainArrayHelpers)
  // console.log(rigidBodyIndex)

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // not exactly sure of best place for this.
      // Need to update parent of isValid so we can enable/disable the "NEXT" button
      console.log('valid:', isValid)
      // setStepIsValid(isValid)
      //   console.log(JSON.stringify(values, null, 2))
    }
    return () => {
      effectRan.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid])

  let content = (
    <React.Fragment key={domainIndex}>
      <Grid
        item
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 1,
          m: 1,
          backgroundColor: '#eaff8f',
          borderRadius: 1
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <React.Fragment>
            <TextField
              //   label="Chain"
              variant="outlined"
              id="chainid"
              //   name="chainid"
              name={`crd_file.rigid_bodies[${rigidBodyIndex}].domains[${domainIndex}].chainid`}
              //   value={`crd_file.rigid_bodies[${rigidBodyIndex}].domains[${domainIndex}].chainid`}
              select
              defaultValue={
                values.crd_file.rigid_bodies[rigidBodyIndex].domains[domainIndex].chainid
                  ? values.crd_file.rigid_bodies[rigidBodyIndex].domains[domainIndex]
                      .chainid
                  : ''
              }
              value={
                values.crd_file.rigid_bodies[rigidBodyIndex].domains[domainIndex].chainid
                  ? values.crd_file.rigid_bodies[rigidBodyIndex].domains[domainIndex]
                      .chainid
                  : ''
              }
              //   checked={value}
              //   sx={{ flex: '0 1 auto' }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.chainid && touched.chainid}
              helperText={errors.chainid && touched.chainid ? errors.chainid : 'Chain ID'}
            >
              {values.crd_file.chains.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.id}
                </MenuItem>
                // <React.Fragment key={index}>
                // <div key={index}>
                //   {values.crd_file.rigid_bodies[rigidBodyIndex].domains[domainIndex]
                //     .chainid === item.id ? (
                //     <MenuItem key={index} value={item.id} selected={true}>
                //       {item.id}
                //     </MenuItem>
                //   ) : (
                //     <MenuItem key={index} value={item.id}>
                //       {item.id}
                //     </MenuItem>
                //   )}
                // </div>
                // </React.Fragment>
              ))}
            </TextField>

            <Typography
              variant="h5"
              sx={{
                display: 'flex',
                flex: '0 1 auto',
                alignItems: 'center',
                mr: 2
              }}
            >
              {domain.chainid} Rigid Domain {rigidBodyIndex + 1}-{domainIndex + 1}:
            </Typography>
            <Chip
              label={`${domain.start} - ${domain.end}`}
              variant="outlined"
              sx={{ backgroundColor: '#a0d919' }}
            />
          </React.Fragment>
        </Box>
        {/* <Box sx={{ flex: '0 1 auto' }} /> */}
        <Grid item sx={{ flex: '0 1 auto', alignItems: 'center' }}>
          <Field
            label="Start"
            id="start"
            name={`crd_file.rigid_bodies[${rigidBodyIndex}].domains[${domainIndex}].start`}
            type="text"
            as={TextField}
            helperText="starting residue"
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(
              errors.crd_file?.rigid_bodies[rigidBodyIndex]?.domains[domainIndex]?.start
            )}
            sx={{ mx: 1 }}
          />

          <Field
            label="End"
            id="end"
            name={`crd_file.rigid_bodies[${rigidBodyIndex}].domains[${domainIndex}].end`}
            type="text"
            as={TextField}
            helperText="ending residue"
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(
              errors.crd_file?.rigid_bodies[rigidBodyIndex]?.domains[domainIndex]?.end
            )}
            sx={{ mx: 1 }}
          />
        </Grid>
      </Grid>
      {/* ERROR GRID CODE HERE */}
    </React.Fragment>
  )
  return content
}

export default Domain
