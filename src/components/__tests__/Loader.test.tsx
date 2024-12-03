import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loader from '../Loader'

describe('Loader Component', () => {
  it('renders a LinearProgress bar', () => {
    render(<Loader />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('applies correct styles to LoaderWrapper', () => {
    const { container } = render(<Loader />)

    const loaderWrapper = container.firstChild
    expect(loaderWrapper).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '2001',
      width: '100%'
    })
  })
})
