import { describe, it, expect } from 'vitest'
import initialValues from '../formInitialValues'
import formModel from '../formModel'

describe('forminitialValues', () => {
  const {
    formField: { pdb_file }
  } = formModel

  it('should define initialValues as an object', () => {
    expect(typeof initialValues).toBe('object')
  })

  it(`should have a property for ${pdb_file.name}`, () => {
    expect(initialValues).toHaveProperty(pdb_file.name)

    const pdbFileInitialValue = initialValues[pdb_file.name]

    // validating the structure of pdb_file
    expect(pdbFileInitialValue).toHaveProperty('file', null)
    expect(pdbFileInitialValue).toHaveProperty('src', null)
    expect(pdbFileInitialValue).toHaveProperty('name', '')
    expect(pdbFileInitialValue).toHaveProperty('chains')
    expect(pdbFileInitialValue).toHaveProperty('rigid_bodies')

    const chains = pdbFileInitialValue.chains
    expect(Array.isArray(chains)).toBe(true)
    expect(chains.length).toBe(1)

    const chain = chains[0]
    expect(chain).toHaveProperty('id', '')
    expect(chain).toHaveProperty('atoms', '')
    expect(chain).toHaveProperty('first_res', '')
    expect(chain).toHaveProperty('last_res', '')
    expect(chain).toHaveProperty('num_res', '')
    expect(chain).toHaveProperty('type', '')

    expect(chain).toHaveProperty('domains')
    const domains = chain.domains
    expect(Array.isArray(domains)).toBe(true)
    expect(domains.length).toBe(1)

    const domain = domains[0]
    expect(domain).toHaveProperty('start', '')
    expect(domain).toHaveProperty('end', '')

    // Validate rigid_bodies structure
    const rigidBodies = pdbFileInitialValue.rigid_bodies
    expect(Array.isArray(rigidBodies)).toBe(true)
    expect(rigidBodies.length).toBe(1)

    const rigidBody = rigidBodies[0]
    expect(rigidBody).toHaveProperty('id', '')

    // Validate domains within rigid_bodies
    expect(rigidBody).toHaveProperty('domains')
    const rigidBodyDomains = rigidBody.domains
    expect(Array.isArray(rigidBodyDomains)).toBe(true)
    expect(rigidBodyDomains.length).toBe(1)

    const rigidBodyDomain = rigidBodyDomains[0]
    expect(rigidBodyDomain).toHaveProperty('chainid', '')
    expect(rigidBodyDomain).toHaveProperty('start', '')
    expect(rigidBodyDomain).toHaveProperty('end', '')
  })
})
