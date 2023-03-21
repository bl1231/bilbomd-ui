import React, { useRef, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import UploadForm from './Forms/UploadForm'
import DomainForm from './Forms/DomainForm'
import DownloadForm from './Forms/DownloadForm'
import formModel from './FormModel/formModel'
import initialValues from './FormModel/formInitialValues'
import validationSchemas from './FormModel/validationSchemas'
import { Form, Formik } from 'formik'
import { Debug } from 'components/Debug'

const steps = ['Upload CRD File', 'Select Rigid domains', 'Create const.inp file']

// interesting idea see Niiima Bastani on codesandbox
const { formId, formField } = formModel

const ConstInpStepper = () => {
  const [activeStep, setActiveStep] = useState(0)
  const currentValidationSchema = validationSchemas[activeStep]
  const [skipped, setSkipped] = useState(new Set())
  const [stepIsValid, setStepIsValid] = useState(false)

  // const formRef = useRef()
  function renderStepContent(step) {
    // console.log('step', step)
    switch (step) {
      case 0:
        return <UploadForm setStepIsValid={setStepIsValid} />
      case 1:
        return <DomainForm setStepIsValid={setStepIsValid} />
      case 2:
        return <DownloadForm setStepIsValid={setStepIsValid} />
      default:
        return <div>Not Found</div>
    }
  }

  const isStepOptional = (step) => {
    // return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    // formRef.current.validate()
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  // useEffect(() => {
  //   if (formRef.current) {
  //     formRef.current.validateForm()
  //   }
  // }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {}
          const labelProps = {}
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>

            <Box sx={{ flex: '1 1 auto' }} />

            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext} disabled={!stepIsValid}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <React.Fragment>
              <Formik
                initialValues={initialValues}
                validationSchema={currentValidationSchema}
                validateOnMount={true}
                enableReinitialize={true}
              >
                {({ values, errors, touched, resetForm, isValid }) => (
                  <Form id={formId}>
                    {renderStepContent(activeStep)}
                    <Debug />
                  </Form>
                )}
              </Formik>
            </React.Fragment>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  )
}

export default ConstInpStepper
