import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Debug } from './Debug' // Assuming Debug component is in the same folder
import { FormikContext, FormikContextType } from 'formik'

// Mock the useTheme hook
vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      mode: 'light'
    }
  })
}))

describe('Debug Component', () => {
  it('should render the Formik state header', () => {
    // Mock Formik context value with empty values object
    const mockFormikContext: FormikContextType<any> = {
      values: {},
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      dirty: false,
      isValid: true,
      initialValues: {},
      initialErrors: {},
      initialTouched: {},
      setFieldValue: vi.fn(),
      setFieldTouched: vi.fn(),
      setFieldError: vi.fn(),
      setValues: vi.fn(),
      setErrors: vi.fn(),
      setTouched: vi.fn(),
      setSubmitting: vi.fn(),
      setStatus: vi.fn(),
      resetForm: vi.fn(),
      submitForm: vi.fn(),
      validateField: vi.fn(),
      validateForm: vi.fn(),
      setFormikState: vi.fn(),
      getFieldProps: vi.fn(),
      getFieldMeta: vi.fn(),
      getFieldHelpers: vi.fn(),
      registerField: vi.fn(),
      unregisterField: vi.fn(),
      handleSubmit: vi.fn(),
      handleReset: vi.fn(),
      handleBlur: vi.fn(),
      handleChange: vi.fn()
    }

    render(
      <FormikContext.Provider value={mockFormikContext}>
        <Debug />
      </FormikContext.Provider>
    )

    // Check if the "Formik State" header is rendered
    expect(screen.getByText(/formik state/i)).toBeInTheDocument()
  })
})
