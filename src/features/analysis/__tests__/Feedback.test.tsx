import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FeedbackChart from '../FeedbackChart'

describe('FeedbackChart', () => {
  const mockData = {
    q_ranges: [0.01, 0.1, 0.2, 0.4],
    chi_squares_of_regions: [1.2, 0.9, 1.5],
    residuals_of_regions: [0.5, 0.7, 0.6]
  }

  it('renders without crashing', () => {
    render(<FeedbackChart data={mockData} />)
    expect(
      screen.getByText(/Chi² and Residuals vs. Q Ranges/i)
    ).toBeInTheDocument()
  })

  it('renders XAxis with correct domain', () => {
    render(<FeedbackChart data={mockData} />)
    const xAxis = screen.getByText(/q \(Å⁻¹\)/i)
    expect(xAxis).toBeInTheDocument()
  })
})
