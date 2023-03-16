import React from 'react'
import { Field, ErrorMessage, FieldArray } from 'formik'
import { Typography } from '@mui/material'

const DomainCard = ({ values }) => {
  return (
    <React.Fragment>
      <Typography>{values.crdFile.chains[0].id}</Typography>
      <FieldArray name="domains">
        {({ insert, remove, push }) => (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </FieldArray>
    </React.Fragment>
  )
}

export default DomainCard
