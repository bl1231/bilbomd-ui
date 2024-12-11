import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BilboMdFeedback from '../BilboMdFeedback'
import { IFeedbackData } from '@bl1231/bilbomd-mongodb-schema'

const mockFeedback: IFeedbackData = {
  best_model: 'Model A',
  overall_chi_square: 1.5,
  mw_saxs: 50,
  mw_model: 55,
  mw_err: 0.08,
  q_ranges: [0.01, 0.1, 0.2],
  chi_squares_of_regions: [0.8, 1.5, 2.5],
  residuals_of_regions: [0.02, 0.05, 0.1],
  highest_chi_square_feedback: 'High chi-square detected in region.',
  second_highest_chi_square_feedback: 'Consider revising the model.',
  mw_feedback: 'MW values are within acceptable range.',
  overall_chi_square_feedback: 'Overall chi-square is acceptable.',
  regional_chi_square_feedback: 'Chi-square values vary across regions.',
  timestamp: new Date()
}

describe('BilboMdFeedback Component', () => {
  it('renders the best model correctly', () => {
    render(<BilboMdFeedback feedback={mockFeedback} />)
    expect(screen.getByText(mockFeedback.best_model)).toBeInTheDocument()
  })

  it('renders feedback text correctly', () => {
    render(<BilboMdFeedback feedback={mockFeedback} />)
    expect(
      screen.getByText(mockFeedback.highest_chi_square_feedback)
    ).toBeInTheDocument()
    expect(
      screen.getByText(mockFeedback.second_highest_chi_square_feedback)
    ).toBeInTheDocument()
    expect(screen.getByText(mockFeedback.mw_feedback)).toBeInTheDocument()
    expect(
      screen.getByText(mockFeedback.overall_chi_square_feedback)
    ).toBeInTheDocument()
    expect(
      screen.getByText(mockFeedback.regional_chi_square_feedback)
    ).toBeInTheDocument()
  })

  it('renders residuals of regions correctly', () => {
    render(<BilboMdFeedback feedback={mockFeedback} />)
    mockFeedback.residuals_of_regions.forEach((value) => {
      const label = screen.getByText(value.toFixed(2))
      expect(label).toBeInTheDocument()
    })
  })
})
