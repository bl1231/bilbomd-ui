import { mixed, object, string } from 'yup'
import { noSpaces, isSaxsData } from './ValidationFunctions'

export const bilbomdScoperJobSchema = object().shape({
  title: string()
    .required('Please provide a title for your BilboMD Scoper Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(30, 'Title must contain less than 30 characters.')
    .matches(/^[\w\s-]+$/, 'no special characters allowed'),

  pdb_file: mixed()
    .test('required', 'PDB file is required', (file) => {
      if (file) return true
      return false
    })
    .test('file-size-check', 'Max file size is 20MB', (file) => {
      if (file && (file as File).size <= 20000000) {
        return true
      }
      return false
    })
    .test('file-type-check', 'Please select a PDB file', (file) => {
      if (
        file &&
        (file as File).name.split('.').pop()?.toUpperCase() === 'PDB'
      ) {
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
  dat_file: mixed()
    .test('required', 'Experimental SAXS data is required', (file) => {
      if (file) return true
      return false
    })
    .test('file-size-check', 'Max file size is 3MB', (file) => {
      if (file && (file as File).size <= 3000000) {
        return true
      }
      return false
    })
    .test(
      'file-type-check',
      'Please select a SAXS *.dat data file.',
      (file) => {
        if (
          file &&
          (file as File).name.split('.').pop()?.toUpperCase() === 'DAT'
        ) {
          return true
        }
        return false
      }
    )
    .test(
      'saxs-data-check',
      'File does not appear to be SAXS data', // Default error message
      async function (file) {
        // Use regular function to keep 'this' context for Yup
        if (file) {
          const result = await isSaxsData(file as File)
          // Check the 'valid' property and use 'message' for custom errors
          if (result.valid) {
            return true
          } else {
            return this.createError({ message: result.message })
          }
        }
        // Fallback error message if no file is provided
        return this.createError({
          message: 'File is required but not provided.'
        })
      }
    )
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
})
