import React, { useEffect, useRef } from 'react'
import { useField, Field, ErrorMessage, FieldArray, useFormikContext } from 'formik'
import { Typography, Grid, Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'

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
  const {
    formField: { domains }
  } = props
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
      console.log(JSON.stringify(domains, null, 2))
      console.log(JSON.stringify(values, null, 2))
    }

    return () => {
      effectRan.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domains])

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
            <FieldArray name="domains">
              {({ insert, remove, push }) => (
                <div>
                  {values.domains.length > 0 &&
                    values.domains.map((domain, index) => (
                      <React.Fragment>
                        <div className="row" key={index}>
                          <div className="col">
                            <label htmlFor={`domains.${index}.id`}>Domain ID</label>
                            <Field
                              name={`domains.${index}.id`}
                              placeholder="chain ID"
                              type="text"
                            />
                            <ErrorMessage
                              name={`domains.${index}.id`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                          <div className="col">
                            <label htmlFor={`domains.${index}.start`}>Domain Start</label>
                            <Field
                              name={`domains.${index}.start`}
                              placeholder="start residue"
                              type="text"
                            />
                            <ErrorMessage
                              name={`domains.${index}.start`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                          <div className="col">
                            <label htmlFor={`domains.${index}.end`}>Domain End</label>
                            <Field
                              name={`domains.${index}.end`}
                              placeholder="end residue"
                              type="text"
                            />
                            <ErrorMessage
                              name={`values.crdFile.domains.${index}.end`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                          <div className="col">
                            <button
                              type="button"
                              className="secondary"
                              onClick={() => remove(index)}
                            >
                              Delete Domain {index + 1}
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => push({ id: '', start: '', end: '' })}
                  >
                    Add Domain
                  </button>
                </div>
              )}
            </FieldArray>
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default DomainForm
