import * as Yup from 'yup'
import { noSpaces } from 'schemas/ValidationFunctions'
import { Chain } from 'types/interfaces'

interface CustomValidateOptions extends Yup.ValidateOptions<Yup.AnyObject> {
  index: number
}

// This is an Array of validationSchema
// Therefore the order must match the order of the multistep forms
const validationSchemas = [
  // File upload
  Yup.object().shape({
    pdb_file: Yup.object().shape({
      file: Yup.mixed()
        .required('Please select a PDB file')
        .test('required', 'Please select a PDB file.', (file) => {
          if (file) return true
          return false
        })
        .test('file-size-check', 'Max file size is 20MB', (file) => {
          const typedFile = file as File | null
          if (typedFile && typedFile.size <= 20000000) {
            return true
          }
          return false
        })
        .test('file-type-check', 'Please select a PDB file.', (file) => {
          if (file && (file as File).name.endsWith('.pdb')) {
            return true
          }
          return false
        })
        .test(
          'check-for-spaces',
          'Only accept file with no spaces in the name.',
          async (file) => {
            const typedFile = file as File
            if (file) {
              const spaceCheck = await noSpaces(typedFile)
              // console.log(spaceCheck)
              return spaceCheck
            }
            return false
          }
        )
        .test(
          'filename-length-check',
          'Filename must be no longer than 30 characters.',
          (file) => {
            if (file && (file as File).name.length <= 30) {
              return true
            }
            return false
          }
        ),
      name: Yup.string().required(),
      chains: Yup.array()
    })
  }),
  // Define rigid domains
  Yup.object({
    pdb_file: Yup.object().shape({
      file: Yup.string().required(),
      src: Yup.string().required(),
      name: Yup.string().required(),
      rigid_bodies: Yup.array(
        Yup.object().shape({
          id: Yup.string().required('need RB name'),
          domains: Yup.array(
            Yup.object().shape({
              chainid: Yup.string().required('Select a ChainID'),
              start: Yup.number()
                .typeError('Must be a number')
                .integer('Integer values only')
                .positive('Positive values only')
                .required('Please provide start residue')
                .test(
                  'check-valid-start-end-res',
                  'Please choose number between chain start and end residue',
                  (value, ctx) => {
                    // Tricky stuff to find where parent values stored.
                    // console.log(ctx)
                    if (!ctx.from) {
                      // Handle the case where ctx.from is undefined
                      // For example, you can return false or throw an error.
                      return false
                    }
                    const chains = ctx.from[2].value.chains as Chain[]
                    const chain = chains.find(
                      (x) => x.id === ctx.parent.chainid
                    )
                    if (!chain) return false
                    // const chainStart = ctx.from[2].value.chains.find(
                    //   (x) => x.id === ctx.parent.chainid
                    // ).first_res

                    // const chainEnd = ctx.from[2].value.chains.find(
                    //   (x) => x.id === ctx.parent.chainid
                    // ).last_res
                    // console.log('chainStart', chainStart)
                    // console.log('chainEnd', chainEnd)
                    // console.log(ctx)
                    // if (value >= chainStart && value <= chainEnd) {
                    //   return true
                    // }
                    if (value >= chain.first_res && value <= chain.last_res) {
                      return true
                    }
                    return false
                  }
                )
                .test(
                  'check-for-overlap',
                  'Please select residue not already in another segment',
                  (value, ctx) => {
                    if (!ctx.from) {
                      return false
                    }
                    const numDomains = ctx.from[1].value.domains.length
                    const domains = ctx.from[1].value.domains

                    for (let idx = 0; idx < numDomains; idx++) {
                      // skip validating against itself
                      if (
                        (ctx.options as CustomValidateOptions).index === idx
                      ) {
                        continue
                      }
                      if (
                        domains[idx].start <= value &&
                        value <= domains[idx].end &&
                        domains[idx].chainid === ctx.parent.chainid
                      ) {
                        return false
                      }
                    }
                    return true
                  }
                )
                .test(
                  'check-for-overlap-in-other-rigid-bodies',
                  'Please ensure no overlap with other Rigid Bodies',
                  (value, ctx) => {
                    if (!ctx.from) {
                      return false
                    }
                    const rigidBodies = ctx.from[2].value.rigid_bodies
                    const numRigidBodies = ctx.from[2].value.rigid_bodies.length
                    // console.log('rigidBodies', rigidBodies)
                    // console.log('numRigidBodies', numRigidBodies)
                    // console.log(ctx)
                    for (let idx = 0; idx < numRigidBodies; idx++) {
                      // loop through domains in rigid body
                      const domains = rigidBodies[idx].domains
                      const numDomains = rigidBodies[idx].domains.length
                      for (let didx = 0; didx < numDomains; didx++) {
                        //skip validating against itself
                        // && same rigid body
                        if (ctx.from[1].value.id === rigidBodies[idx].id) {
                          // console.log('skip')
                          continue
                        }
                        //https://stackoverflow.com/questions/36035074/how-can-i-find-an-overlap-between-two-given-ranges
                        const eee = Math.max(
                          domains[didx].start,
                          ctx.parent.start
                        )
                        const fff = Math.min(domains[didx].end, ctx.parent.end)
                        if (
                          eee <= fff &&
                          domains[didx].chainid === ctx.parent.chainid
                        ) {
                          return false
                        }
                      }
                    }
                    // console.log('no overlap')
                    return true
                  }
                ),
              end: Yup.number()
                .typeError('Must be a number.')
                .integer('Integer values only')
                .positive('Positive values only')
                .moreThan(Yup.ref('start'), 'End should be greater than start')
                .required('Please provide end residue')
                .test(
                  'check-valid-start-end-res',
                  'Please choose number between chain start and end residue',
                  (value, ctx) => {
                    if (!ctx.from) {
                      return false
                    }
                    const chainStart = ctx.from[2].value.chains.find(
                      (x) => x.id === ctx.parent.chainid
                    ).first_res
                    const chainEnd = ctx.from[2].value.chains.find(
                      (x) => x.id === ctx.parent.chainid
                    ).last_res
                    if (value >= chainStart && value <= chainEnd) {
                      return true
                    }
                    return false
                  }
                )
                .test(
                  'check-for-overlap',
                  'Please select residue not already in another segment',
                  (value, ctx) => {
                    if (!ctx.from) {
                      return false
                    }
                    const numDomains = ctx.from[1].value.domains.length
                    const domains = ctx.from[1].value.domains
                    for (let idx = 0; idx < numDomains; idx++) {
                      // skip validating against itself
                      if (
                        (ctx.options as CustomValidateOptions).index === idx
                      ) {
                        continue
                      }
                      if (
                        domains[idx].start <= value &&
                        value <= domains[idx].end &&
                        domains[idx].chainid === ctx.parent.chainid
                      ) {
                        return false
                      }
                    }
                    return true
                  }
                )
                .test(
                  'check-for-overlap-in-other-rigid-bodies',
                  'Please ensure no overlap with other Rigid Bodies or Segments',
                  (value, ctx) => {
                    if (!ctx.from) {
                      return false
                    }
                    const rigidBodies = ctx.from[2].value.rigid_bodies
                    const numRigidBodies = ctx.from[2].value.rigid_bodies.length
                    for (let idx = 0; idx < numRigidBodies; idx++) {
                      // loop through domains in rigid body
                      const domains = rigidBodies[idx].domains
                      const numDomains = rigidBodies[idx].domains.length
                      for (let didx = 0; didx < numDomains; didx++) {
                        //skip validating against itself
                        // && same rigid body
                        if (ctx.from[1].value.id === rigidBodies[idx].id) {
                          continue
                        }
                        //https://stackoverflow.com/questions/36035074/how-can-i-find-an-overlap-between-two-given-ranges
                        const eee = Math.max(
                          domains[didx].start,
                          ctx.parent.start
                        )
                        const fff = Math.min(domains[didx].end, ctx.parent.end)
                        if (
                          eee <= fff &&
                          domains[didx].chainid === ctx.parent.chainid
                        ) {
                          return false
                        }
                      }
                    }
                    // console.log('no overlap')
                    return true
                  }
                )
            })
          ).min(0, 'please prove at least one rigid domain')
        })
      ).min(1, 'Need at least one protein or nucleic acid chain')
    })
  })
]

export default validationSchemas
