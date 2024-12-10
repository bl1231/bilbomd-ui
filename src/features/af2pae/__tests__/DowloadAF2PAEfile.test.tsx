import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useSelector } from 'react-redux'
import Download from '../DownloadAF2PAEfile' // Adjust the path as necessary
import { axiosInstance } from 'app/api/axios'

vi.mock('app/api/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}))

// Mock useSelector
vi.mock('react-redux', () => ({
  useSelector: vi.fn()
}))

describe('Download Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSelector as unknown as Mock).mockReturnValue('mocked-token') // Mock token return value
  })

  it('renders the Download button', () => {
    render(<Download uuid='mock-uuid' />)

    const button = screen.getByRole('button', { name: /download/i })
    expect(button).toBeInTheDocument()
  })

  it('handles download on button click successfully', async () => {
    const mockBlob = new Blob(['mock data'], {
      type: 'application/octet-stream'
    })
    ;(axiosInstance.get as Mock).mockResolvedValueOnce({
      data: mockBlob
    })

    render(<Download uuid='mock-uuid' />)

    const button = screen.getByRole('button', { name: /download/i })
    fireEvent.click(button)

    // Assert that Axios was called with correct parameters
    expect(axiosInstance.get).toHaveBeenCalledWith('af2pae?uuid=mock-uuid', {
      responseType: 'blob',
      headers: {
        Authorization: 'Bearer mocked-token'
      }
    })

    // Simulate user interaction with the download process
    await new Promise((resolve) => setTimeout(resolve, 0)) // Wait for async operations to complete
  })

  it('handles errors gracefully on download failure', async () => {
    ;(axiosInstance.get as Mock).mockRejectedValueOnce(
      new Error('Download error')
    )

    render(<Download uuid='mock-uuid' />)

    const button = screen.getByRole('button', { name: /download/i })
    fireEvent.click(button)

    // Assert that Axios was called but an error occurred
    expect(axiosInstance.get).toHaveBeenCalledWith('af2pae?uuid=mock-uuid', {
      responseType: 'blob',
      headers: {
        Authorization: 'Bearer mocked-token'
      }
    })
  })
})
