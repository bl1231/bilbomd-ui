import React, { useState } from 'react'
import { Field, ErrorMessage, FieldArray, useFormikContext } from 'formik'
import { Typography } from '@mui/material'

const DomainCard = ({ chainIndex }) => {
  const [domain, setDomain] = useState('')
  const { values } = useFormikContext()

  const handleAddDomain = () => {
    const domain = {}
    domain.start = '1'
    domain.end = '33'
  }

  return (
    <React.Fragment>
      {/* <Typography variant="h5">{chain.id}</Typography> */}
      {/* <Typography variant="h5">{values.crdFile.chains[idx].id}</Typography> */}
      {/* <Typography variant="h5">{values.crdFile.chains[idx].atoms}</Typography> */}
      {/* <Typography variant="h5">{values.crdFile.chains[idx].domains[0].id}</Typography> */}
      {/* {<pre>{JSON.stringify(chain, null, 3)}</pre>} */}
      <FieldArray name={`values.crdFile.chains[${chainIndex}].domains`}>
        {({ insert, remove, push }) => (
          <React.Fragment>
            {`values.crdFile.chains[${chainIndex}].domains.length` > 0 &&
              `values.crdFile.chains[${chainIndex}].domains.map`((domain, index) => (
                // <p key={index}>
                //   domain{domain} index{index}
                // </p>
                // <pre key={index}>{JSON.stringify(domain, null, 3)}</pre>

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
          </React.Fragment>
        )}
      </FieldArray>
    </React.Fragment>
  )
}

export default DomainCard
