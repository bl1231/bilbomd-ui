import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FileSelect from '../FileSelect'

const mockFile = new File(['file contents'], 'example.dat', {
  type: 'application/octet-stream'
})

const baseProps = {
  value: mockFile,
  fileType: 'experimental SAXS data',
  fileExt: '.dat',
  id: 'file-dat_file-file-upload',
  name: 'dat_file',
  title: 'Select File',
  error: false,
  disabled: false,
  setFieldValue: vi.fn(),
  setFieldTouched: vi.fn(),
  onFileChange: vi.fn(),
  handleBlur: vi.fn()
}

describe('FileSelect', () => {
  it('renders the button and label correctly', () => {
    render(<FileSelect {...baseProps} />)
    expect(screen.getByText('Select File')).toBeInTheDocument()
    const label = screen.getByTestId('file-input-label')
    expect(label.textContent).toContain(
      'Upload your experimental SAXS data file'
    )
    expect(label.querySelector('b')?.textContent).toBe('experimental SAXS data')
  })

  it('displays success alert with filename when no error', () => {
    render(<FileSelect {...baseProps} />)
    expect(screen.getByText('example.dat')).toBeInTheDocument()
  })

  it('displays error message when error is true', () => {
    render(
      <FileSelect
        {...baseProps}
        error={true}
        errorMessage='Invalid file type'
      />
    )
    expect(screen.getByText('Invalid file type')).toBeInTheDocument()
  })

  it('handles file change correctly', async () => {
    vi.stubGlobal(
      'FileReader',
      class {
        onload: () => void = () => {}
        onerror: () => void = () => {}
        readAsDataURL() {
          this.onload()
        }
      }
    )

    render(<FileSelect {...baseProps} />)

    const input = screen.getByLabelText('Select File') as HTMLInputElement

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [mockFile] } })
    })

    await waitFor(() => {
      expect(baseProps.setFieldValue).toHaveBeenCalledWith(
        'dat_file',
        mockFile,
        true
      )
      expect(baseProps.setFieldTouched).toHaveBeenCalledWith(
        'dat_file',
        true,
        false
      )
      expect(baseProps.onFileChange).toHaveBeenCalledWith(mockFile)
    })
  })
})
