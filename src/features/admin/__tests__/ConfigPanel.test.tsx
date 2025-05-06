import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import ConfigPanel from '../ConfigPanel'
import { useGetConfigsQuery } from 'slices/configsApiSlice'

vi.mock('slices/configsApiSlice', async () => {
  const actual = await vi.importActual('slices/configsApiSlice')
  return {
    ...actual,
    useGetConfigsQuery: vi.fn()
  }
})

const mockedUseGetConfigsQuery = vi.mocked(useGetConfigsQuery)

describe('ConfigPanel', () => {
  it('renders a spinner while loading', () => {
    mockedUseGetConfigsQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isFetching: true,
      isSuccess: false,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<ConfigPanel />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders an error alert on error', () => {
    mockedUseGetConfigsQuery.mockReturnValue({
      data: null,
      error: { message: 'Error' },
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: true,
      refetch: vi.fn()
    })

    renderWithProviders(<ConfigPanel />)
    expect(screen.getByText(/error loading data/i)).toBeInTheDocument()
  })

  it('renders a warning when no data is returned', () => {
    mockedUseGetConfigsQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<ConfigPanel />)
    expect(
      screen.getByText(/no configuration data available/i)
    ).toBeInTheDocument()
  })

  it('renders a table with configuration data', () => {
    mockedUseGetConfigsQuery.mockReturnValue({
      data: {
        tokenExpires: 900,
        useNersc: true,
        nerscProject: 'ABC123'
      },
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn()
    })

    renderWithProviders(<ConfigPanel />)

    expect(screen.getByText(/configuration/i)).toBeInTheDocument()
    expect(screen.getByText('tokenExpires')).toBeInTheDocument()
    expect(screen.getByText('900')).toBeInTheDocument()
    expect(screen.getByText('useNersc')).toBeInTheDocument()
    expect(screen.getByText('true')).toBeInTheDocument()
    expect(screen.getByText('nerscProject')).toBeInTheDocument()
    expect(screen.getByText('ABC123')).toBeInTheDocument()
  })
})
