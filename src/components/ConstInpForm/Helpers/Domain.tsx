import { Fragment, FC } from 'react'
import { Field, useFormikContext, ErrorMessage } from 'formik'
import {
  Grid,
  TextField,
  Typography,
  Chip,
  Alert,
  MenuItem,
  AlertProps
} from '@mui/material'
import { Box } from '@mui/system'
import { Chain, RigidBody, RigidDomain } from 'types/interfaces'

interface DomainProps {
  rigidBodyIndex: number
  domain: RigidDomain
  domainIndex: number
}
interface FormValues {
  pdb_file: {
    chains: Chain[]
    rigid_bodies: RigidBody[]
  }
}
type FormErrors = Partial<{
  pdb_file: {
    chains: Partial<Chain>[] | string
    rigid_bodies: Partial<RigidBody>[] | string
  }
}>

interface FormikErrorAlertProps extends AlertProps {
  message: string
}

const FormikErrorAlert: FC<FormikErrorAlertProps> = ({ message, ...alertProps }) => {
  return <Alert {...alertProps}>{message}</Alert>
}

const Domain: FC<DomainProps> = ({
  rigidBodyIndex: rbidx,
  domain,
  domainIndex: didx
}) => {
  const { values, handleChange, handleBlur, errors } = useFormikContext<
    FormValues & { errors: FormErrors }
  >()

  const typedErrors = errors
  // const typedErrors = errors?.pdb_file?.rigid_bodies ?? []

  const content = (
    <Fragment key={didx}>
      <Grid item>
        <Grid
          item
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: '0 3 auto',
            p: 1,
            m: 1
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <TextField
              label="Chain"
              variant="outlined"
              id="chainid"
              name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].chainid`}
              select
              defaultValue={
                values.pdb_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  ? values.pdb_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  : ''
              }
              value={
                values.pdb_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  ? values.pdb_file.rigid_bodies[rbidx]?.domains[didx]?.chainid
                  : ''
              }
              sx={{ flex: '0 0 auto' }}
              // FormHelperTextProps={
              //   typedErrors.pdb_file?.rigid_bodies[rbidx]?.domains[didx]?.chainid
              //     ? {
              //         style: { backgroundColor: 'transparent' }
              //       }
              //     : {
              //         style: { backgroundColor: 'transparent', color: 'black' }
              //       }
              // }
              InputLabelProps={{
                style: { backgroundColor: 'transparent', color: 'black' }
              }}
              InputProps={{ style: { color: 'black' } }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!typedErrors.pdb_file?.rigid_bodies[rbidx]?.domains[didx]?.chainid}
              helperText="Chain ID"
            >
              {values.pdb_file.chains.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.id}
                </MenuItem>
              ))}
            </TextField>

            <Field
              label="Start"
              id="start"
              name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].start`}
              type="text"
              as={TextField}
              helperText="Starting residue"
              // FormHelperTextProps={
              //   typedErrors?.pdb_file?.rigid_bodies[rbidx]?.domains[didx]?.start
              //     ? {
              //         style: { backgroundColor: 'transparent' }
              //       }
              //     : {
              //         style: { backgroundColor: 'transparent', color: 'black' }
              //       }
              // }
              InputLabelProps={{
                style: { backgroundColor: 'transparent', color: 'black' }
              }}
              InputProps={{ style: { color: 'black' } }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!typedErrors?.pdb_file?.rigid_bodies[rbidx]?.domains[didx]?.start}
              sx={{ mx: 1, color: 'black' }}
            />

            <Field
              label="End"
              id="end"
              name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].end`}
              type="text"
              as={TextField}
              helperText="Ending residue"
              // FormHelperTextProps={
              //   typedErrors.pdb_file?.rigid_bodies[rbidx]?.domains[didx]?.end
              //     ? {
              //         style: { backgroundColor: 'transparent' }
              //       }
              //     : {
              //         style: { backgroundColor: 'transparent', color: 'black' }
              //       }
              // }
              InputLabelProps={{
                style: { backgroundColor: 'transparent', color: 'black' }
              }}
              InputProps={{ style: { color: 'black' } }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!typedErrors?.pdb_file?.rigid_bodies[rbidx]?.domains[didx]?.end}
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
                  mx: 2,
                  color: 'black'
                }}
              >
                {domain.chainid} - Rigid Domain #{didx + 1}:
              </Typography>
              <Chip
                label={`${domain.start} - ${domain.end}`}
                variant="outlined"
                sx={{ backgroundColor: '#a0d919', color: 'black' }}
              />
            </Box>
          </Box>
        </Grid>
        {/* ERROR GRID CODE HERE */}
        <Grid item sx={{ flex: '0 1 auto', mb: 1 }}>
          <ErrorMessage name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].chainid`}>
            {(msg) => <FormikErrorAlert message={msg} severity="error" />}
          </ErrorMessage>
          <ErrorMessage name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].start`}>
            {(msg) => <FormikErrorAlert message={msg} severity="error" />}
          </ErrorMessage>
          <ErrorMessage name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].end`}>
            {(msg) => <FormikErrorAlert message={msg} severity="error" />}
          </ErrorMessage>
        </Grid>
      </Grid>
    </Fragment>
  )
  return content
}

export default Domain
