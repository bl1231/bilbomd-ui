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

const DomainForm = (props) => {
  useTitle('BilboMD: Create const.inp file')
  // const {
  //   formField: { crdFile }
  // } = props
  const { values } = useFormikContext()
  // const [field, meta, helper] = useField(domains.name)
  // const { touched, error } = meta
  // const { setValue } = helper
  // const isError = touched && error && true
  // const { value } = field

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      console.log('DomainForm useEffect ran')
      // console.log(JSON.stringify(crdFile, null, 2))
      console.log(JSON.stringify(values, null, 2))
    }

    return () => {
      effectRan.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Instructions</Typography>
          <Item>
            <Typography variant="h4" sx={{ ml: 1 }}>
              Define regions to remain rigid
            </Typography>
            <p>
              Instructions here. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.
            </p>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Define Rigid Domains</Typography>
          <Item>
            <Typography variant="h5">
              Found {values.crdFile.chains.length} Chains
            </Typography>
            <Grid item sx={{ my: 1, backgroundColor: '#fcffe6' }}>
              {values.crdFile.chains.map((chain, index) => (
                // <DomainCard chain={chain} chainIndex={index} values={values} />
                <div key={chain.id + index}>
                  <br />
                  <span>
                    chain {index + 1}: {chain.id} domains:
                  </span>
                  <FieldArray name={`crdFile.chains[${index}].domains`}>
                    {(arrayHelpers) => (
                      <>
                        <br />
                        <Domains chainIndex={index} domainsArrayHelpers={arrayHelpers} />
                      </>
                    )}
                  </FieldArray>
                </div>
              ))}
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default DomainForm
