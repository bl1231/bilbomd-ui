import { describe, it, vi, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PAEJiffyInstructions from '../PAEJiffyInstructions'

vi.mock('slices/jobsApiSlice', () => ({
  useAf2PaeJiffyMutation: vi.fn(() => [
    vi.fn().mockResolvedValue({ uuid: '1234-5678' }),
    { error: null, isError: false }
  ])
}))

vi.mock('features/jobs/FileSelect', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>
}))

describe('PAEJiffyInstructions Component', () => {
  it('renders the instructions correctly', () => {
    render(<PAEJiffyInstructions />)

    expect(screen.getByText('Instructions')).toBeInTheDocument()

    expect(screen.getByTestId('ExpandMoreIcon')).toBeInTheDocument()
  })

  it('displays all links correctly', () => {
    render(<PAEJiffyInstructions />)

    const accordionButton = screen.getByRole('button', {
      name: /instructions/i
    })
    fireEvent.click(accordionButton)

    expect(
      screen.getByRole('link', { name: /Predicted Aligned Error/i })
    ).toHaveAttribute('href', 'https://alphafold.ebi.ac.uk/faq#faq-13')
    expect(screen.getByRole('link', { name: /pLDDT/i })).toHaveAttribute(
      'href',
      'https://alphafold.ebi.ac.uk/faq#faq-12'
    )
    expect(
      screen.getByRole('link', { name: /cluster_leiden\(\)/i })
    ).toHaveAttribute(
      'href',
      'https://igraph.org/r/html/1.3.0/cluster_leiden.html'
    )
    expect(screen.getByRole('link', { name: /igraph/i })).toHaveAttribute(
      'href',
      'https://igraph.org/'
    )
    expect(
      screen.getByRole('link', { name: /Traag, van Eck & Waltman/i })
    ).toHaveAttribute('href', 'https://doi.org/10.1038/s41598-019-41695-z')
  })
})
