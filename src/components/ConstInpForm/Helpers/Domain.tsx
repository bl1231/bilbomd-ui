import { Fragment, FC } from 'react'
import { Field, useFormikContext, ErrorMessage, getIn } from 'formik'
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
import { useTheme } from '@mui/material/styles'

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

const FormikErrorAlert: FC<FormikErrorAlertProps> = ({
  message,
  ...alertProps
}) => {
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
  const theme = useTheme()

  // Assuming you have a way to access the chain ID from the domain
  const currentChainId = domain.chainid
  // Find the chain object that matches the currentChainId
  const matchingChain = values.pdb_file.chains.find(
    (chain) => chain.id === currentChainId
  )

  const customColors = {
    PRO: theme.palette.mode === 'light' ? '#E6A8A8' : '#b76e79',
    DNA: theme.palette.mode === 'light' ? '#E9D8A6' : '#b3a272',
    RNA: theme.palette.mode === 'light' ? '#B5E3D8' : '#6daba4',
    CAR: theme.palette.mode === 'light' ? '#A8CCE6' : '#6b95b8',
    Other: theme.palette.mode === 'light' ? '#D1A8E6' : '#9773b9'
  }
  // Determine the background color based on the matching chain's type
  const cardBackgroundColor = matchingChain
    ? customColors[matchingChain.type] ?? theme.palette.grey[400]
    : theme.palette.grey[400]

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
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <TextField
              label='Chain'
              variant='outlined'
              id='chainid'
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
              InputLabelProps={{
                style: { backgroundColor: 'transparent', color: 'black' }
              }}
              InputProps={{ style: { color: 'black' } }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(
                getIn(
                  errors,
                  `pdb_file.rigid_bodies[rbidx].domains[didx].chainid`
                )
              )}
              helperText='Chain ID'
            >
              {values.pdb_file.chains.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.id}
                </MenuItem>
              ))}
            </TextField>

            <Field
              label='Start'
              id='start'
              name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].start`}
              type='text'
              as={TextField}
              helperText='Starting residue'
              InputLabelProps={{
                style: { backgroundColor: 'transparent', color: 'black' }
              }}
              InputProps={{ style: { color: 'black' } }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(
                getIn(
                  errors,
                  `pdb_file.rigid_bodies[rbidx].domains[didx].start`
                )
              )}
              sx={{ mx: 1, color: 'black' }}
            />

            <Field
              label='End'
              id='end'
              name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].end`}
              type='text'
              as={TextField}
              helperText='Ending residue'
              InputLabelProps={{
                style: { backgroundColor: 'transparent', color: 'black' }
              }}
              InputProps={{ style: { color: 'black' } }}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(
                getIn(errors, `pdb_file.rigid_bodies[rbidx].domains[didx].end`)
              )}
              sx={{ mx: 1 }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                border: 1,
                borderColor: 'grey.400',
                backgroundColor: cardBackgroundColor || '#f6ffed',
                borderRadius: 2,
                ml: 1,
                px: 1,
                py: 3
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  mx: 2,
                  color: 'black'
                }}
              >
                {domain.chainid} - Rigid Domain #{didx + 1}:
              </Typography>
              <Chip
                label={`${domain.start} - ${domain.end}`}
                variant='outlined'
                sx={{ backgroundColor: '#a0d919', color: 'black' }}
              />
            </Box>
          </Box>
        </Grid>
        {/* ERROR GRID CODE HERE */}
        <Grid item sx={{ flex: '0 1 auto', mb: 1 }}>
          <ErrorMessage
            name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].chainid`}
          >
            {(msg) => <FormikErrorAlert message={msg} severity='error' />}
          </ErrorMessage>
          <ErrorMessage
            name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].start`}
          >
            {(msg) => <FormikErrorAlert message={msg} severity='error' />}
          </ErrorMessage>
          <ErrorMessage
            name={`pdb_file.rigid_bodies[${rbidx}].domains[${didx}].end`}
          >
            {(msg) => <FormikErrorAlert message={msg} severity='error' />}
          </ErrorMessage>
        </Grid>
      </Grid>
    </Fragment>
  )
  return content
}

export default Domain
