import { describe, it, vi, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'
import CopyToClipboardButton from './CopyToClipboardButton'

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
})

describe('CopyToClipboardButton', () => {
  it('renders the button with the correct text', () => {
    render(<CopyToClipboardButton text='Test text' />)
    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
  })

  it('copies text to clipboard when the button is clicked', async () => {
    const testText = 'Test text'
    render(<CopyToClipboardButton text={testText} />)

    const button = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(button)

    // Verify that navigator.clipboard.writeText was called with the correct text
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText)
  })

  it('displays a snackbar when the button is clicked', async () => {
    render(
      <SnackbarProvider>
        <CopyToClipboardButton text='Test text' />
      </SnackbarProvider>
    )

    const button = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(button)

    await waitFor(() => {
      const snackbar = screen.queryByText(/copied to clipboard/i)
      expect(snackbar).toBeTruthy()
    })
  })
})
