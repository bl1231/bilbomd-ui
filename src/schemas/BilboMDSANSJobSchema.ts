import { mixed, object, string } from 'yup'
import { noSpaces, isSaxsData } from './ValidationFunctions'

// const isAminoAcidSequence = (sequence: string) => {
//   const aminoAcidRegex = /^[ACDEFGHIKLMNPQRSTVWY]+$/i
//   return aminoAcidRegex.test(sequence)
// }

const BilboMDSANSJobSchema = object().shape({
  title: string()
    .required('Please provide a title for your BilboMD SANS Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(30, 'Title must contain less than 30 characters.')
    .matches(/^[\w\s-]+$/, 'No special characters allowed'),

  dat_file: mixed()
    .required('Experimental SAXS data is required')
    .test('file-size-check', 'Max file size is 2MB', (file) => {
      return file && (file as File).size <= 2000000
    })
    .test(
      'file-type-check',
      'Please select a SAXS *.dat data file.',
      (file) => {
        return (
          file && (file as File).name.split('.').pop()?.toUpperCase() === 'DAT'
        )
      }
    )
    .test(
      'saxs-data-check',
      'File does not appear to be SAXS data',
      async function (file) {
        if (file) {
          const result = await isSaxsData(file as File)
          if (result.valid) return true
          return this.createError({ message: result.message })
        }
        return this.createError({
          message: 'File is required but not provided.'
        })
      }
    )
    .test(
      'check-for-spaces',
      'Only accept file with no spaces in the name.',
      async (file) => {
        return file ? await noSpaces(file as File) : false
      }
    )
    .test(
      'filename-length-check',
      'Filename must be no longer than 30 characters.',
      (file) => {
        return file && (file as File).name.length <= 30
      }
    )
})

export { BilboMDSANSJobSchema }
