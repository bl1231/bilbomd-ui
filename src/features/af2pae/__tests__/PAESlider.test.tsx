import { render, screen } from '@testing-library/react'
import { expect, test, describe, beforeEach } from 'vitest'
import PAESlider from '../PAESlider'
import { useState } from 'react'

const TestWrapper = () => {
  const [value, setValue] = useState(3) // Initial value matches the DOM

  // Mock implementation of setFieldValue
  const setFieldValue = (field: string, newValue: number | number[]) => {
    if (field === 'pae_power') {
      setValue(newValue as number)
    }
  }

  return <PAESlider value={value} setFieldValue={setFieldValue} />
}

describe('PAESlider Component', () => {
  beforeEach(() => {
    render(<TestWrapper />)
  })

  test('renders the slider with correct initial value', () => {
    // Check that the Chip displays the initial value
    const chip = screen.getByText('3', { selector: 'span.MuiChip-label' })
    expect(chip).toBeInTheDocument()
  })

  test('renders all marks on the slider', () => {
    const marks = ['1.5', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    marks.forEach((mark) => {
      const markLabel = screen.getByText(mark, {
        selector: 'span.MuiSlider-markLabel'
      })
      expect(markLabel).toBeInTheDocument()
    })
  })

  test('displays an info alert with correct text', () => {
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(
      'A smaller weight will result in fewer clusters (i.e. rigid shapes).'
    )
    expect(alert).toHaveTextContent(
      'A larger weight will result in more clusters.'
    )
    expect(alert).toHaveTextContent(
      'CHARMM allows a maximum of 20 shape definitions.'
    )
    expect(alert).toHaveTextContent(
      'If PAE Jiffy™ produces more than 20 please re-run with a lower weight.'
    )
  })
})
