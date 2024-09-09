import { mixed, object, string, array, number } from 'yup'
import { noSpaces, isSaxsData } from './ValidationFunctions'

const isAminoAcidSequence = (sequence: string) => {
  const aminoAcidRegex = /^[ACDEFGHIKLMNPQRSTVWY]+$/i
  return aminoAcidRegex.test(sequence)
}

const BilboMDAlphaFoldJobSchema = object().shape({
  title: string()
    .required('Please provide a title for your BilboMD Job.')
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
    ),

  entities: array()
    .of(
      object().shape({
        name: string(), // Hidden field, but still required in the object structure
        sequence: string()
          .required('Please provide the sequence.')
          .min(10, 'Sequence must contain at least 10 characters.')
          .test(
            'is-amino-acid-sequence',
            'Sequence must be a valid amino acid sequence.',
            function (sequence) {
              const { type } = this.parent // Access the parent object to check the 'type'
              if (type === 'Protein') {
                return isAminoAcidSequence(sequence)
              }
              return true // Skip validation if it's not a protein
            }
          ),
        type: string()
          .required('Please select a Molecule Type.')
          .oneOf(['Protein', 'DNA', 'RNA'], 'Invalid Molecule Type'),
        copies: number()
          .required('Please provide the number of copies.')
          .min(1, 'Copies must be at least 1.')
      })
    )
    .min(1, 'At least one entity is required.')
    .required('Entities are required')
})

export { BilboMDAlphaFoldJobSchema }
