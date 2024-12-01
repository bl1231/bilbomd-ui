// roles.test.js

import { describe, it, expect } from 'vitest'
import { ROLES } from './roles' // Adjust the path as necessary

describe('ROLES constant', () => {
  it('should have User role', () => {
    expect(ROLES.User).toBe('User')
  })

  it('should have Manager role', () => {
    expect(ROLES.Manager).toBe('Manager')
  })

  it('should have Admin role', () => {
    expect(ROLES.Admin).toBe('Admin')
  })

  it('should have exactly three roles', () => {
    expect(Object.keys(ROLES)).toHaveLength(3)
  })
})
