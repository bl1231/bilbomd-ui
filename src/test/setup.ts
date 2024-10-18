import '@testing-library/jest-dom'
import '@testing-library/jest-dom/vitest'
import '@testing-library/react'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
