import '@testing-library/jest-dom'
import '@testing-library/jest-dom/vitest'
import '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './server'

// Polyfill ResizeObserver for Recharts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset any request handlers after each test
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Clean up after all tests are finished
afterAll(() => server.close())
