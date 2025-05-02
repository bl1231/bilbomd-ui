import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import JobDBDetails from '../JobDBDetails'
import { createMockBilboMDJob } from 'test/mockJob'
import { renderWithProviders } from 'test/rendersWithProviders'

vi.mock('slices/jobsApiSlice', () => ({
  useLazyGetFileByIdAndNameQuery: () => [
    vi.fn(),
    { data: 'Mock file contents', isLoading: false, error: false }
  ]
}))

describe('JobDBDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders basic job information', () => {
    renderWithProviders(<JobDBDetails job={createMockBilboMDJob()} />)
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('MongoDB ID:')).toBeInTheDocument()
    expect(screen.getByText('example.dat')).toBeInTheDocument()
  })

  it('opens the dialog when constraint chip is clicked', async () => {
    renderWithProviders(<JobDBDetails job={createMockBilboMDJob()} />)
    const chip = screen.getByText('const.inp')
    fireEvent.click(chip)
    await waitFor(() => {
      expect(screen.getByText('CHARMM Constraint File')).toBeInTheDocument()
    })
  })

  it('copies file contents to clipboard', async () => {
    const writeText = vi.fn()
    Object.assign(navigator, { clipboard: { writeText } })

    renderWithProviders(<JobDBDetails job={createMockBilboMDJob()} />)

    // Click the chip to open dialog
    fireEvent.click(screen.getByText('const.inp'))

    // Wait for the copy icon button to appear
    const copyButton = await screen.findByRole('button', {
      name: 'copy-constraint-file'
    })
    fireEvent.click(copyButton)
    expect(writeText).toHaveBeenCalledWith('Mock file contents')
  })
})
