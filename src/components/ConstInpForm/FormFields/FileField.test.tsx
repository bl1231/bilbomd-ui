import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FileField from './FileField'

describe('FileField Component', () => {
  let mockSetFieldValue: ReturnType<typeof vi.fn>
  let mockOnChange: ReturnType<typeof vi.fn>

  // here we define the default props for the FileField component
  const defaultProps = {
    id: 'file-upload',
    name: 'file',
    title: 'Upload File',
    isError: false,
    errorMessage: '',
    fileExt: '.png,.jpg',
    setFieldValue: vi.fn(),
    onChange: vi.fn()
  }

  beforeEach(() => {
    // Reset mocks before each test
    mockSetFieldValue = vi.fn()
    mockOnChange = vi.fn()
  })

  it('renders the FileField component with the correct title', () => {
    render(<FileField {...defaultProps} />)

    // Verify that the button with the title is rendered
    expect(screen.getByText('Upload File')).toBeInTheDocument()
  })

  it('calls setFieldValue and displays the file name when a file is uploaded', async () => {
    render(
      <FileField
        {...defaultProps}
        setFieldValue={mockSetFieldValue}
        onChange={mockOnChange}
      />
    )

    const inputElement = screen.getByLabelText('Upload File')
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png'
    })

    fireEvent.change(inputElement, { target: { files: [file] } })

    // Verify that setFieldValue is called with correct arguments
    expect(mockSetFieldValue).toHaveBeenCalledWith('file', file)

    // Verify that the success alert displays the uploaded file name
    expect(await screen.findByText('example.png')).toBeInTheDocument()

    // Verify that onChange is called
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('displays an error message when isError is true', () => {
    const errorProps = {
      ...defaultProps,
      isError: true,
      errorMessage: 'Invalid file type'
    }

    render(<FileField {...errorProps} />)

    // Verify that the error alert displays the error message
    expect(screen.getByText('Invalid file type')).toBeInTheDocument()
  })

  it('does not call setFieldValue if no file is selected', () => {
    render(
      <FileField
        {...defaultProps}
        setFieldValue={mockSetFieldValue}
        onChange={mockOnChange}
      />
    )

    // Simulate clicking on the input without selecting a file
    const inputElement = screen.getByLabelText('Upload File')
    fireEvent.change(inputElement, { target: { files: [] } })

    // Verify that setFieldValue is not called
    expect(mockSetFieldValue).not.toHaveBeenCalled()
  })

  it('handles multiple files gracefully by only processing the first one', async () => {
    render(
      <FileField
        {...defaultProps}
        setFieldValue={mockSetFieldValue}
        onChange={mockOnChange}
      />
    )

    // Simulate selecting multiple files
    const inputElement = screen.getByLabelText('Upload File')
    const files = [
      new File(['content1'], 'file1.png', { type: 'image/png' }),
      new File(['content2'], 'file2.jpg', { type: 'image/jpeg' })
    ]

    fireEvent.change(inputElement, { target: { files } })

    // Verify that only the first file is processed
    expect(mockSetFieldValue).toHaveBeenCalledWith('file', files[0])
  })
})
