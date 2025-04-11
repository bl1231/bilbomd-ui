import { render, screen } from '@testing-library/react'
import StatsPanel, { StatsPanelProps } from '../BilboMDStats'
import { describe, it, expect } from 'vitest'

describe('StatsPanel', () => {
  const mockStats: StatsPanelProps['stats'] = {
    userCount: 5,
    jobCount: 10,
    totalJobsFromUsers: 25,
    jobTypes: {
      alphafold: 8,
      auto: 11,
      pdb: 6
    }
  }

  it('renders header and overall stats', () => {
    render(<StatsPanel stats={mockStats} />)

    expect(screen.getByText(/System Statistics/i)).toBeInTheDocument()
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
    expect(screen.getByText(/Current Jobs/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Jobs/i)).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders job types with correct counts', () => {
    render(<StatsPanel stats={mockStats} />)

    expect(screen.getByText(/Jobs by Type/i)).toBeInTheDocument()
    expect(screen.getByText(/ALPHAFOLD/i)).toBeInTheDocument()
    expect(screen.getByText(/AUTO/i)).toBeInTheDocument()
    expect(screen.getByText(/PDB/i)).toBeInTheDocument()

    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('returns null when no stats are passed', () => {
    const { container } = render(
      <StatsPanel stats={null as StatsPanelProps['stats'] | null} />
    )
    expect(container.firstChild).toBeNull()
  })
})
