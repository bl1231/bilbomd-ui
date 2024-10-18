import App from './App'
import { renderWithProviders } from 'test/test-utils'
import { act } from '@testing-library/react'

// Mock the useGetConfigsQuery call from the authApiSlice
vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn(() => ({
    data: { mode: 'test', useNersc: 'false' }, // Example mock response
    isLoading: false,
    isError: false,
    error: null
  }))
}))

describe('App Component', () => {
  it('renders without crashing', async () => {
    let container: HTMLElement | null = null

    await act(async () => {
      const result = renderWithProviders(<App />)
      container = result.container
    })

    // Add a null check to avoid TypeScript error
    expect(container).not.toBeNull()
    expect(container).toBeInTheDocument()
  })
})
