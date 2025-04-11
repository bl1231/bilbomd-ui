import { render, screen } from '@testing-library/react'
import ConfigPanel, { ConfigPanelProps } from '../ConfigPanel'
import { describe, it, expect } from 'vitest'

describe('ConfigPanel', () => {
  const baseConfig: ConfigPanelProps['config'] = {
    stringKey: 'value',
    numberKey: 123,
    boolTrue: true,
    boolFalse: false,
    nullKey: null,
    objectKey: { nested: 'yes' },
    arrayKey: ['a', 'b']
  }

  it('renders table rows for each key-value pair', () => {
    render(<ConfigPanel config={baseConfig} />)

    expect(screen.getByText(/stringKey/i)).toBeInTheDocument()
    expect(screen.getByText('value')).toBeInTheDocument()
    expect(screen.getByText(/numberKey/i)).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText(/boolTrue/i)).toBeInTheDocument()
    expect(screen.getByText('true')).toBeInTheDocument()
    expect(screen.getByText(/boolFalse/i)).toBeInTheDocument()
    expect(screen.getByText('false')).toBeInTheDocument()
    expect(screen.getByText(/nullKey/i)).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText(/objectKey/i)).toBeInTheDocument()
    expect(
      screen.getByText(JSON.stringify({ nested: 'yes' }))
    ).toBeInTheDocument()
    expect(screen.getByText(/arrayKey/i)).toBeInTheDocument()
    expect(screen.getByText(JSON.stringify(['a', 'b']))).toBeInTheDocument()
  })

  it('renders nothing when config is null', () => {
    const { container } = render(<ConfigPanel config={null} />)
    expect(container.firstChild).toBeNull()
  })
})
