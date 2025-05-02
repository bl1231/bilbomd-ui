import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import DeleteJob from '../DeleteJob'
import { renderWithProviders } from 'test/rendersWithProviders'

// Mock the RTK Query hook
vi.mock('slices/jobsApiSlice', () => ({
  useDeleteJobMutation: () => [
    vi.fn().mockResolvedValue({}),
    { isSuccess: true, isError: false, error: null }
  ]
}))

describe('DeleteJob', () => {
  it('renders delete button with label', () => {
    renderWithProviders(<DeleteJob id='abc123' title='Test Job' hide={false} />)
    expect(screen.getByRole('button', { name: /trash/i })).toBeInTheDocument()
  })

  it('opens confirmation dialog on click', async () => {
    renderWithProviders(<DeleteJob id='abc123' title='Test Job' hide={false} />)
    fireEvent.click(screen.getByRole('button', { name: /trash/i }))
    expect(
      await screen.findByText(/are you sure you want to delete/i)
    ).toBeInTheDocument()
  })

  it('calls onClose after deletion', async () => {
    const mockOnClose = vi.fn()
    renderWithProviders(
      <DeleteJob
        id='abc123'
        title='Test Job'
        hide={false}
        onClose={mockOnClose}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /trash/i }))
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})
