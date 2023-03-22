import React, { useEffect, useRef } from 'react'
import { useFormikContext, FieldArray } from 'formik'
import { Typography, Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'
import DomainCard from '../Helpers/DomainCard'
import Domains from '../Helpers/Domains'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px'
}

const DomainForm = ({ setStepIsValid }) => {
  useTitle('BilboMD: define domains')
  const { values, isValid } = useFormikContext()

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      setStepIsValid(isValid)
      // console.log(JSON.stringify(values, null, 2))
    }
    return () => {
      effectRan.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid])

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Instructions</Typography>
          <Item>
            <Typography variant="h4" sx={{ m: 1 }}>
              Define regions to remain rigid
            </Typography>
            <Typography sx={{ m: 1 }}>
              This is pretty straight forward. You need to define which ranges of residues
              are to remain rigid during the Molecular Dynamics steps of a <b>BilboMD</b>{' '}
              run. Please be aware of teh following.
              <li>No overlapping regions</li>
              <li>No Minimum or Maximum numbers of rigid body domains</li>
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Define Rigid Domains</Typography>
          <Item>
            <Typography variant="h5" sx={{ mx: 1, my: 2 }}>
              {values.crd_file.name} has {values.crd_file.chains.length} Chains
            </Typography>
            <Grid item sx={{ my: 1, backgroundColor: '#fcffe6' }}>
              {values.crd_file.chains.map((chain, index) => (
                <React.Fragment key={index}>
                  <Typography variant="h6" sx={{ ml: 1, mb: 1 }}>
                    ChainID: <b>{chain.id}</b> Number of Residues: <b>{chain.num_res}</b>{' '}
                    Start: <b>{chain.first_res}</b> End: <b>{chain.last_res}</b>
                  </Typography>

                  <FieldArray name={`crd_file.chains[${index}].domains`}>
                    {(arrayHelpers) => (
                      <React.Fragment>
                        <Domains chainIndex={index} domainsArrayHelpers={arrayHelpers} />
                      </React.Fragment>
                    )}
                  </FieldArray>
                </React.Fragment>
              ))}
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default DomainForm
