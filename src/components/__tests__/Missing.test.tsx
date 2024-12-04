import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Missing from '../Missing'

describe('Missing Component', () => {
  it('renders the 404 image with correct alt text', () => {
    render(<Missing />)

    const image = screen.getByRole('img', {
      name: /These are not the pages you are looking for/i
    })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/obiwan_404.jpg')
  })
})
