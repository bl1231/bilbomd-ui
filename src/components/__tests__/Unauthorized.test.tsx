import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Unauthorized from '../Unauthorized'

describe('Unauthorized Component', () => {
  it('renders an alert with the correct title and message', () => {
    render(<Unauthorized />)

    const alertTitle = screen.getByText('Warning')
    expect(alertTitle).toBeInTheDocument()

    const alertMessage = screen.getByText(
      'You do not have access to the requested page.'
    )
    expect(alertMessage).toBeInTheDocument()

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
  })
})
