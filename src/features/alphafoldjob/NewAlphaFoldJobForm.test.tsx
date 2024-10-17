import { renderWithProviders } from 'test/test-utils'
import { screen, waitFor, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NewAlphaFoldJob from './NewAlphaFoldJobForm'
import { useAddNewAlphaFoldJobMutation } from 'slices/jobsApiSlice'

// Mock the Config API slice for testing
vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn(() => ({
    data: { sendMailUser: 'test@example.com' },
    error: null,
    isLoading: false
  }))
}))
// Mock the jobsApiSlice globally for all tests
vi.mock('slices/jobsApiSlice', () => ({
  useAddNewAlphaFoldJobMutation: vi.fn()
}))
describe('NewAlphaFoldJob Form', () => {
  const mockSubmit = vi.fn()

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()

    // Set up mock behavior for the mutation hook
    vi.mocked(useAddNewAlphaFoldJobMutation).mockReturnValue([
      mockSubmit,
      { isSuccess: false, reset: vi.fn() } // Default state
    ])
  })

  it('renders the form without crashing async', async () => {
    renderWithProviders(<NewAlphaFoldJob />)
    await waitFor(() => {
      expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
      expect(screen.getByText(/BilboMD AF Schematic/i)).toBeInTheDocument()
      expect(screen.getByText(/BilboMD AF Job Form/i)).toBeInTheDocument()
      expect(screen.getByText(/Select File/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /Submit/i })
      ).toBeInTheDocument()
    })
  })
  it('renders the form without crashing', () => {
    renderWithProviders(<NewAlphaFoldJob />)

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
    expect(screen.getByText(/BilboMD AF Schematic/i)).toBeInTheDocument()
    expect(screen.getByText(/BilboMD AF Job Form/i)).toBeInTheDocument()
    expect(screen.getByText(/Select File/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
  })
  it('updates the Title field when input is entered', async () => {
    renderWithProviders(<NewAlphaFoldJob />)

    const titleField = screen.getByLabelText(/Title/i)
    await act(async () => {
      fireEvent.change(titleField, { target: { value: 'New AlphaFold Job' } })
    })

    expect((titleField as HTMLInputElement).value).toBe('New AlphaFold Job')
  })
  it('adds a new entity when Add Entity button is clicked', async () => {
    renderWithProviders(<NewAlphaFoldJob />)

    const addEntityButton = screen.getByRole('button', {
      name: /Add Entity/i
    })
    await act(async () => {
      fireEvent.click(addEntityButton)
    })
    expect(screen.getAllByLabelText(/Molecule Type/i).length).toBe(2)
  })
  it('shows validation errors for empty Title field', async () => {
    renderWithProviders(<NewAlphaFoldJob />)

    // Trigger validation manually using Formik's validateForm
    await act(async () => {
      fireEvent.focusOut(screen.getByLabelText(/Title/i))
    })

    // Wait for validation error messages to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Please provide a title for your BilboMD Job/i)
      ).toBeInTheDocument()
    })
  })
  it('shows validation errors for empty AA Sequence field', async () => {
    renderWithProviders(<NewAlphaFoldJob />)

    // Trigger validation manually using Formik's validateForm
    await act(async () => {
      fireEvent.focusOut(screen.getByLabelText(/Amino Acid Sequence/i))
    })

    // Wait for validation error messages to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Please provide the sequence/i)
      ).toBeInTheDocument()
    })
  })
  // it('shows success message after form submission', async () => {
  //   const mockSubmit = vi.fn().mockResolvedValue({ success: true })

  //   // Mock the mutation to return a successful response
  //   vi.mocked(useAddNewAlphaFoldJobMutation).mockReturnValue([
  //     mockSubmit,
  //     { isSuccess: true, reset: vi.fn() }
  //   ])

  //   renderWithProviders(<NewAlphaFoldJob />)
  //   screen.debug()
  //   // Fill out the Title field
  //   await act(async () => {
  //     fireEvent.change(screen.getByLabelText(/Title/i), {
  //       target: { value: 'New AlphaFold Job' }
  //     })
  //   })

  //   // Create a mock file
  //   const file = new File(['file content'], 'example.dat', {
  //     type: 'text/plain'
  //   })

  //   // Fill out the SAXS dat file with the mock file
  //   const fileInput = screen.getByLabelText(/Select File/i)
  //   await act(async () => {
  //     fireEvent.change(fileInput, {
  //       target: { files: [file] }
  //     })
  //   })

  //   // By default, the form starts with one entity, let's modify that entity
  //   await act(async () => {
  //     fireEvent.change(screen.getByLabelText(/Amino Acid Sequence/i), {
  //       target: { value: 'MASQSYLFKHLEVSDGLSNNSVNTIYK' }
  //     })
  //   })

  //   // Check if the submit button is enabled
  //   const submitButton = screen.getByRole('button', { name: /Submit/i })
  //   expect(submitButton).not.toBeDisabled()

  //   // Trigger form submission
  //   await act(async () => {
  //     fireEvent.click(submitButton)
  //   })

  //   // Wait for the success message to appear after form submission
  //   await waitFor(() => {
  //     expect(
  //       screen.getByText(/Your job has been submitted/i)
  //     ).toBeInTheDocument()
  //   })

  //   // Assert that the mutation function (mockSubmit) was called
  //   expect(mockSubmit).toHaveBeenCalled()

  //   // Debugging output if necessary
  //   console.log(mockSubmit.mock.calls)
  // })
})
