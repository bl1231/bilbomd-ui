import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
  Mock
} from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useSelector } from 'react-redux'
import Download from '../DownloadAF2PAEfile'
import { axiosInstance } from 'app/api/axios'

global.URL.createObjectURL = vi.fn((blob) => `mock-blob-url-for-${blob}`)

// Mock axios instance
vi.mock('app/api/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}))

// Mock react-redux useSelector
vi.mock('react-redux', () => ({
  useSelector: vi.fn()
}))

// Suppress all console logs and errors
const originalConsoleLog = console.log
const originalConsoleError = console.error
beforeAll(() => {
  console.log = vi.fn()
  console.error = vi.fn()
})
afterAll(() => {
  console.log = originalConsoleLog
  console.error = originalConsoleError
})

// Mock out link creation to prevent navigation errors
// Instead of real <a> element, return a mock object with needed methods
const originalCreateElement = document.createElement
beforeAll(() => {
  document.createElement = vi.fn((tagName: string) => {
    if (tagName.toLowerCase() === 'a') {
      return {
        href: '',
        setAttribute: vi.fn(),
        click: vi.fn(),
        parentNode: {
          removeChild: vi.fn()
        }
      } as unknown as HTMLElement
    }
    return originalCreateElement.call(document, tagName)
  })
})
afterAll(() => {
  document.createElement = originalCreateElement
})

describe('Download Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSelector as unknown as Mock).mockReturnValue('mocked-token')
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
    ;(axiosInstance.get as Mock).mockResolvedValueOnce({ data: mockBlob })

    render(<Download uuid='mock-uuid' />)
    const button = screen.getByRole('button', { name: /download/i })
    fireEvent.click(button)

    expect(axiosInstance.get).toHaveBeenCalledWith('af2pae?uuid=mock-uuid', {
      responseType: 'blob',
      headers: {
        Authorization: 'Bearer mocked-token'
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('handles errors gracefully on download failure', async () => {
    ;(axiosInstance.get as Mock).mockRejectedValueOnce(
      new Error('Download error')
    )

    render(<Download uuid='mock-uuid' />)
    const button = screen.getByRole('button', { name: /download/i })
    fireEvent.click(button)

    expect(axiosInstance.get).toHaveBeenCalledWith('af2pae?uuid=mock-uuid', {
      responseType: 'blob',
      headers: {
        Authorization: 'Bearer mocked-token'
      }
    })

    expect(console.error).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
