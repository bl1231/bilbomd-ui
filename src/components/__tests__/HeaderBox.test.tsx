import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeaderBox from '../HeaderBox'

describe('HeaderBox', () => {
  it('renders children correctly', () => {
    render(<HeaderBox>Test Header</HeaderBox>)
    expect(screen.getByText('Test Header')).toBeInTheDocument()
  })

  it('applies default styles correctly', () => {
    render(<HeaderBox>Styled Header</HeaderBox>)
    const headerElement = screen.getByText('Styled Header')

    expect(headerElement).toHaveStyle({
      textTransform: 'uppercase',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      fontWeight: '500',
      padding: '16px 0.5rem 16px 0.5rem', // Updated padding
      background: '#888',
      color: '#fff',
      letterSpacing: '1px'
    })
  })

  //  it('applies custom sx prop styles correctly', () => {
  //   render(
  //     <ChakraProvider> {/* Include if using Chakra UI */}
  //       <HeaderBox sx={{ backgroundColor: 'red' }}>
  //         Custom Styled Header
  //       </HeaderBox>
  //     </ChakraProvider>
  //   )
  //   const headerElement = screen.getByText('Custom Styled Header')

  //   // Optional: Debug to inspect styles
  //   // screen.debug(headerElement)

  //   expect(headerElement).toHaveStyle('background-color: red')
  // })
})
