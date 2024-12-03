import { render } from '@testing-library/react'
import ErrorFallback from '../ErrorFallback'

test('renders error message and alert role', () => {
  // Mock error object
  const error = { message: 'Test error message' }

  // Render the component with the mock error
  const { getByRole, getByText } = render(<ErrorFallback error={error} />)

  // Check if the alert role is present
  expect(getByRole('alert')).toBeInTheDocument()

  // Check if the static text is rendered correctly
  expect(
    getByText(
      'Something went wrong. Please send a screenshot of the error message to Scott.'
    )
  ).toBeInTheDocument()

  // Check if the error message is displayed in red
  expect(getByText('Test error message')).toBeInTheDocument()
})
