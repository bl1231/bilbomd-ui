import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JobActionsMenu } from '../JobActionsMenu'

const baseProps = {
  jobId: 'abc123',
  jobType: 'BilboMdPDB',
  jobTitle: 'Test Job',
  jobStatus: 'Completed',
  anchorEl: document.createElement('div'),
  open: true,
  onClose: vi.fn(),
  onResubmit: vi.fn(),
  onDelete: vi.fn()
}

describe('JobActionsMenu', () => {
  it('renders both actions', () => {
    render(<JobActionsMenu {...baseProps} />)
    expect(screen.getByText('Resubmit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('disables Resubmit for non-resubmittable types', () => {
    render(<JobActionsMenu {...baseProps} jobType='BilboMdAlphaFold' />)
    expect(screen.getByText('Resubmit')).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })

  it('disables Delete for running jobs', () => {
    render(<JobActionsMenu {...baseProps} jobStatus='Running' />)
    expect(screen.getByText('Delete')).toHaveAttribute('aria-disabled', 'true')
  })

  it('calls onResubmit and onClose when Resubmit is clicked', () => {
    render(<JobActionsMenu {...baseProps} />)
    fireEvent.click(screen.getByText('Resubmit'))
    expect(baseProps.onResubmit).toHaveBeenCalledWith('abc123', 'BilboMdPDB')
    expect(baseProps.onClose).toHaveBeenCalled()
  })

  it('calls onDelete and onClose when Delete is clicked', () => {
    render(<JobActionsMenu {...baseProps} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(baseProps.onDelete).toHaveBeenCalledWith('abc123', 'Test Job')
    expect(baseProps.onClose).toHaveBeenCalled()
  })
})
