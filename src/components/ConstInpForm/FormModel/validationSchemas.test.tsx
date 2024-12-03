import { describe, it, expect } from 'vitest'
import validationSchemas from './validationSchemas'

describe('validationSchemas', () => {
  const [fileUploadSchema, rigidDomainsSchema] = validationSchemas

  describe('File Upload Schema', () => {
    const validFile = new File(['dummy content'], 'example.pdb', {
      type: 'text/plain'
    })

    it('should accept a valid PDB file', async () => {
      const validData = { pdb_file: { file: validFile, name: 'example.pdb' } }
      await expect(fileUploadSchema.validate(validData)).resolves.toBeTruthy()
    })

    it('should reject files larger than 20MB', async () => {
      const largeFile = new File(['a'.repeat(21000000)], 'large.pdb', {
        type: 'text/plain'
      })
      const invalidData = { pdb_file: { file: largeFile, name: 'large.pdb' } }
      await expect(fileUploadSchema.validate(invalidData)).rejects.toThrow(
        'Max file size is 20MB'
      )
    })

    it('should reject files with spaces in the name', async () => {
      const spacedFile = new File(['dummy content'], 'example with space.pdb', {
        type: 'text/plain'
      })
      const invalidData = {
        pdb_file: { file: spacedFile, name: 'example with space.pdb' }
      }
      await expect(fileUploadSchema.validate(invalidData)).rejects.toThrow(
        'Only accept file with no spaces in the name.'
      )
    })

    it('should reject files with names longer than 30 characters', async () => {
      const longNameFile = new File(
        ['dummy content'],
        'averylongfilenameexceedingthirtycharacters.pdb',
        {
          type: 'text/plain'
        }
      )
      const invalidData = {
        pdb_file: {
          file: longNameFile,
          name: 'averylongfilenameexceedingthirtycharacters.pdb'
        }
      }
      await expect(fileUploadSchema.validate(invalidData)).rejects.toThrow(
        'Filename must be no longer than 30 characters.'
      )
    })

    it('should reject files that are not PDB files', async () => {
      const nonPdbFile = new File(['dummy content'], 'example.txt', {
        type: 'text/plain'
      })
      const invalidData = {
        pdb_file: { file: nonPdbFile, name: 'example.txt' }
      }
      await expect(fileUploadSchema.validate(invalidData)).rejects.toThrow(
        'Please select a PDB file.'
      )
    })
  })

  describe('Rigid Domains Schema', () => {
    const validRigidDomainData = {
      pdb_file: {
        file: '',
        src: '',
        name: '',
        rigid_bodies: [
          {
            id: 'RB1',
            domains: [
              {
                chainid: 'A',
                start: 5,
                end: 10
              }
            ]
          }
        ],
        chains: [
          {
            id: 'A',
            first_res: 1,
            last_res: 100
          }
        ]
      }
    }

    it('should require rigid body ID', async () => {
      const invalidData = JSON.parse(JSON.stringify(validRigidDomainData))
      invalidData.pdb_file.rigid_bodies[0].id = ''
      await expect(rigidDomainsSchema.validate(invalidData)).rejects.toThrow(
        'need RB name'
      )
    })

    // Add test cases for chain ID and start residue requirements

    it('should ensure end residue is greater than start residue', async () => {
      const invalidData = JSON.parse(JSON.stringify(validRigidDomainData))
      invalidData.pdb_file.rigid_bodies[0].domains[0].end = 4
      await expect(rigidDomainsSchema.validate(invalidData)).rejects.toThrow(
        'End should be greater than start'
      )
    })

    it('should ensure no overlap within the same rigid body domains', async () => {
      const overlappingDomainsData = JSON.parse(
        JSON.stringify(validRigidDomainData)
      )
      overlappingDomainsData.pdb_file.rigid_bodies[0].domains.push({
        chainid: 'A',
        start: 8,
        end: 12
      })
      await expect(
        rigidDomainsSchema.validate(overlappingDomainsData)
      ).rejects.toThrow('Please select residue not already in another segment')
    })

    it('should ensure no overlap across different rigid bodies', async () => {
      const overlappingRigidBodiesData = JSON.parse(
        JSON.stringify(validRigidDomainData)
      )
      overlappingRigidBodiesData.pdb_file.rigid_bodies.push({
        id: 'RB2',
        domains: [
          {
            chainid: 'A',
            start: 8,
            end: 12
          }
        ]
      })
      await expect(
        rigidDomainsSchema.validate(overlappingRigidBodiesData)
      ).rejects.toThrow(
        'Please ensure no overlap with other Rigid Bodies or Segments'
      )
    })
  })
})
