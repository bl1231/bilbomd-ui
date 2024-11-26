import { describe, it, expect } from 'vitest'
import formModel from './formModel'

describe('formModel', () => {
  it('should have the correct formId', () => {
    expect(formModel.formId).toBe('formId')
  })

  it('should define formField with the correct structure', () => {
    expect(formModel.formField).toBeDefined()
    expect(typeof formModel.formField).toBe('object')
  })

  describe('formField.pdb_file', () => {
    const pdbFile = formModel.formField.pdb_file

    it('should define pdb_file with correct properties', () => {
      expect(pdbFile).toBeDefined()
      expect(pdbFile).toHaveProperty('name', 'pdb_file')
      expect(pdbFile).toHaveProperty('label', 'Please upload a PDB File')
      expect(pdbFile).toHaveProperty(
        'reviewLabel',
        'Your PDB file is still here: '
      )
      expect(pdbFile).toHaveProperty('requiredErrorMsg', 'PDB file is required')
      expect(pdbFile).toHaveProperty('type', 'file')
      expect(pdbFile).toHaveProperty('rigid_bodies', '')
    })
  })

  describe('formField.domains', () => {
    const domains = formModel.formField.domains

    it('should define domains with correct properties', () => {
      expect(domains).toBeDefined()
      expect(domains).toHaveProperty('name', 'domains')
      expect(domains).toHaveProperty('label', 'Select some domains')
      expect(domains).toHaveProperty('type', 'text')
    })
  })
})
