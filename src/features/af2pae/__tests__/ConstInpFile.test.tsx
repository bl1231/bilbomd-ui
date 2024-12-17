import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ConstInpFile from '../ConstInpFile'

vi.mock('components/Common/CopyToClipboardButton', () => ({
  default: ({ text }: { text: string }) => (
    <button data-testid='copy-button'>{text}</button>
  )
}))

describe('ConstInpFile Component', () => {
  it('renders correctly with given constfile prop', () => {
    const constfileContent = 'Sample content for testing'

    render(<ConstInpFile constfile={constfileContent} />)

    const typographyElement = screen.getByText(constfileContent, {
      selector: 'p' // Specify that we are looking for a <p> element
    })
    expect(typographyElement).toBeInTheDocument()

    const copyButton = screen.getByTestId('copy-button')
    expect(copyButton).toBeInTheDocument()
    expect(copyButton).toHaveTextContent(constfileContent)
  })
})
