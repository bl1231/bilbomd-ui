import { mixed } from 'yup'
import { noSpaces } from './ValidationFunctions'

const pdbFileSchema = mixed()
  .test('required', 'PDB file is required', (file) => {
    if (file) return true
    return false
  })
  .test('file-size-check', 'Max file size is 2MB', (file) => {
    if (file && (file as File).size <= 2000000) {
      // console.log(file.size)
      return true
    }
    // console.log(file.size)
    return false
  })
  .test('file-type-check', 'Only accepts a *.pdb file.', (file) => {
    if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'PDB') {
      // console.log(file.name.split('.').pop())
      return true
    }
    return false
  })
  .test(
    'check-for-spaces',
    'Only accept file with no spaces in the name.',
    async (file) => {
      if (file) {
        const spaceCheck = await noSpaces(file as File)
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
  )

export { pdbFileSchema }
