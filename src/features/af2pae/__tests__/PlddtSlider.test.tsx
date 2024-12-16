import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, beforeEach } from 'vitest'
import PlddtSlider from '../PlddtSlider'
import { useState } from 'react'

const TestWrapper = () => {
  const [value, setValue] = useState(50)

  // Mock implementation of setFieldValue
  const setFieldValue = (field: string, newValue: number | number[]) => {
    if (field === 'plddt_cutoff') {
      setValue(newValue as number)
    }
  }

  return <PlddtSlider value={value} setFieldValue={setFieldValue} />
}

describe('PlddtSlider Component', () => {
  beforeEach(() => {
    render(<TestWrapper />)
  })

  test('renders the slider with correct initial value', () => {
    // Check that the Chip displays the initial value
    const chip = screen.getByText('50', { selector: 'span.MuiChip-label' })
    expect(chip).toBeInTheDocument()
  })

  test('renders slider with correct min and max values', () => {
    const slider = screen.getByRole('slider') as HTMLInputElement
    expect(slider).toHaveAttribute('aria-valuemin', '10')
    expect(slider).toHaveAttribute('aria-valuemax', '98')
  })

  test('calls setFieldValue when slider value changes', async () => {
    const sliderInput = screen.getByRole('slider') as HTMLInputElement

    fireEvent.change(sliderInput, { target: { value: 60 } })

    await waitFor(() => {
      const updatedChip = screen.getByText('60', {
        selector: 'span.MuiChip-label'
      })
      expect(updatedChip).toBeInTheDocument()
    })
  })

  test('handles slider drag interactions correctly', async () => {
    const sliderInput = screen.getByRole('slider') as HTMLInputElement

    fireEvent.change(sliderInput, { target: { value: 70 } })

    // Wait for the Chip to update with the new value
    await waitFor(() => {
      const updatedChip = screen.getByText('70', {
        selector: 'span.MuiChip-label'
      })
      expect(updatedChip).toBeInTheDocument()
    })
  })

  test('displays an info alert with correct text', () => {
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(
      'The pLDDT cutoff value is used to determine if a rigid domain determined from the PAE matrix should be included in the const.inp file.'
    )
    expect(alert).toHaveTextContent(
      'A lower pLDDT cutoff will result in more rigid domains.'
    )
    expect(alert).toHaveTextContent(
      'A higher pLDDT cutoff will result in fewer rigid domains.'
    )
  })
})
