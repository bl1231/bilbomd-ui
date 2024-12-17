import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NewAlphaFoldJobFormInstructions from '../NewAlphaFoldJobFormInstructions'

describe('NewAlphaFoldJobFormInstructions', () => {
  it('displays an alert with important information about AlphaFold versions', () => {
    render(<NewAlphaFoldJobFormInstructions />)

    // Expand the accordion to reveal content
    fireEvent.click(screen.getByText(/Instructions/i))

    // Verify that the alert is displayed
    const alertTitle = screen.getByText(
      /Important information about AlphaFold2 vs. AlphaFold3/i
    )
    expect(alertTitle).toBeInTheDocument()

    // Check for specific content within the alert
    const colabFoldLink = screen.getByRole('link', { name: /ColabFold/i })
    expect(colabFoldLink).toHaveAttribute(
      'href',
      'https://github.com/sokrypton/ColabFold'
    )

    const alphaFold3Link = screen.getByRole('link', { name: /AlphaFold3/i })
    expect(alphaFold3Link).toHaveAttribute(
      'href',
      'https://alphafoldserver.com/'
    )
  })

  it('renders references with correct links and citations', () => {
    render(<NewAlphaFoldJobFormInstructions />)

    // Expand the accordion to reveal content
    fireEvent.click(screen.getByText(/Instructions/i))

    // Check for reference links
    const pubMedLink = screen.getByRole('link', { name: /35637307/i })
    expect(pubMedLink).toHaveAttribute(
      'href',
      'https://pubmed.ncbi.nlm.nih.gov/35637307/'
    )

    const protocolExchangeLink = screen.getByRole('link', {
      name: /Version 1, 01 Dec, 2023 Protocol Exchange/i
    })
    expect(protocolExchangeLink).toHaveAttribute(
      'href',
      'https://doi.org/10.21203/rs.3.pex-2490/v1'
    )
  })
})
