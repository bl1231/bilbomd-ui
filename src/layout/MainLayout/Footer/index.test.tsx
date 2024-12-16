import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Footer from './index'
import { useGetConfigsQuery } from 'slices/configsApiSlice'
import { version } from '../../../../package.json'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

// Mock the RTK Query hook
vi.mock('slices/configsApiSlice', () => ({
  useGetConfigsQuery: vi.fn()
}))

interface ConfigData {
  uiGitHash: string
}

// Use the correct types provided by RTK Query
type QueryResult = ReturnType<typeof useGetConfigsQuery>

describe('Footer Component', () => {
  const mockConfig: ConfigData = {
    uiGitHash: 'abc123'
  }

  const useGetConfigsQueryMock = vi.mocked(useGetConfigsQuery)

  it('renders loading state', () => {
    const loadingState: QueryResult = {
      data: undefined,
      error: undefined,
      isLoading: true,
      isFetching: false,
      isSuccess: false,
      isError: false,
      isUninitialized: false,
      status: 'pending',
      refetch: vi.fn().mockResolvedValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        isSuccess: false,
        isError: false,
        status: 'fulfilled'
      })
    }

    useGetConfigsQueryMock.mockReturnValue(loadingState)
    render(<Footer />)
    expect(screen.getByText('Loading config data...')).toBeInTheDocument()
  })

  it('renders error state', () => {
    const errorState: QueryResult = {
      data: undefined,
      error: { status: 500, data: 'Test error' } as FetchBaseQueryError,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: true,
      isUninitialized: false,
      status: 'rejected',
      refetch: vi.fn().mockResolvedValue({
        data: undefined,
        error: { status: 500, data: 'Refetch error' } as FetchBaseQueryError,
        isLoading: false,
        isSuccess: false,
        isError: true,
        status: 'rejected'
      })
    }

    useGetConfigsQueryMock.mockReturnValue(errorState)
    render(<Footer />)
    expect(
      screen.getByText('Error loading configuration data')
    ).toBeInTheDocument()
  })

  it('renders no config state', () => {
    const noConfigState: QueryResult = {
      data: undefined,
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: false,
      isUninitialized: true,
      status: 'uninitialized',
      refetch: vi.fn().mockResolvedValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        isSuccess: false,
        isError: false,
        status: 'fulfilled'
      })
    }

    useGetConfigsQueryMock.mockReturnValue(noConfigState)
    render(<Footer />)
    expect(
      screen.getByText('No configuration data available')
    ).toBeInTheDocument()
  })

  it('renders footer content correctly', () => {
    const successState: QueryResult = {
      data: mockConfig,
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      isUninitialized: false,
      status: 'fulfilled',
      refetch: vi.fn().mockResolvedValue({
        data: mockConfig,
        error: undefined,
        isLoading: false,
        isSuccess: true,
        isError: false,
        status: 'fulfilled'
      })
    }

    useGetConfigsQueryMock.mockReturnValue(successState)
    const currentYear = new Date().getFullYear()
    render(<Footer />)

    expect(
      screen.getByText('"dynamicity... the essence of BilboMD"')
    ).toBeInTheDocument()
    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument()
    expect(
      screen.getByText(currentYear.toString(), { exact: false })
    ).toBeInTheDocument()

    const link = screen.getByText('SIBYLS Beamline')
    expect(link).toHaveAttribute('href', 'https://bl1231.als.lbl.gov')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')

    expect(
      screen.getByText(`BilboMD v${version}-${mockConfig.uiGitHash}`, {
        exact: false
      })
    ).toBeInTheDocument()
  })
})
