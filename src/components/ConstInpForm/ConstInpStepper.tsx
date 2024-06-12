import { useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import UploadForm from './Forms/UploadForm'
import DomainForm from './Forms/DomainForm'
import { Preview } from './Forms/Preview'
import formModel from './FormModel/formModel'
import initialValues from './FormModel/formInitialValues'
import validationSchemas from './FormModel/validationSchemas'
import { Form, Formik } from 'formik'
import { Debug } from 'components/Debug'
import { Alert } from '@mui/material'

const steps = ['Upload PDB File', 'Select Rigid domains', 'Preview & Download']

// interesting idea see Niiima Bastani on codesandbox
const { formId } = formModel

const ConstInpStepper = () => {
  const [activeStep, setActiveStep] = useState(0)
  const currentValidationSchema = validationSchemas[activeStep]
  const [skipped, setSkipped] = useState(new Set())
  const [stepIsValid, setStepIsValid] = useState(false)

  function renderStepContent(step) {
    switch (step) {
      case 0:
        return <UploadForm setStepIsValid={setStepIsValid} />
      case 1:
        return <DomainForm setStepIsValid={setStepIsValid} />
      case 2:
        return <Preview />

      default:
        return <div>Not Found</div>
    }
  }

  const isStepSkipped = (step: number) => {
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

  const handleReset = () => {
    setActiveStep(0)
  }

  type StepProps = {
    completed?: boolean
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: StepProps = {}
          const labelProps = {}
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
        <>
          <Alert variant='outlined' sx={{ mt: 4 }}>
            Woot! That&apos;s it. Reset the form if you want to create a new{' '}
            <b>const.inp file.</b>
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
            <Box sx={{ flex: '0 1 50%', alignItems: 'center' }} />
            <Button variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant='contained'
              sx={{ mr: 1 }}
            >
              Back
            </Button>

            <Box sx={{ flex: '1 1 auto' }} />

            <Button
              onClick={handleNext}
              disabled={!stepIsValid}
              variant='contained'
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              pt: 2,
              flex: '0 1 100%'
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={currentValidationSchema}
              validateOnMount={false}
              enableReinitialize={true}
              onSubmit={(values, { resetForm }) => {
                // Handle form submission logic here
                // You can access form values using the `values` parameter
                // You can reset the form using the `resetForm` function

                // Example:
                console.log(values) // Access form values

                // Reset the form after submission
                resetForm()
              }}
            >
              {() => (
                <Form id={formId}>
                  {renderStepContent(activeStep)}
                  {process.env.NODE_ENV === 'development' ? <Debug /> : ''}
                </Form>
              )}
            </Formik>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color='inherit'
              disabled={activeStep === 0}
              onClick={handleBack}
              variant='contained'
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            <Button
              onClick={handleNext}
              disabled={!stepIsValid}
              variant='contained'
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default ConstInpStepper
