import { object, string, array, number } from 'yup'
import {
  requiredFile,
  fileExtTest,
  fileSizeTest,
  fileNameLengthTest,
  noSpacesTest,
  saxsCheck
} from './fieldTests/fieldTests'

const isAminoAcidSequence = (sequence: string) => {
  const aminoAcidRegex = /^[ACDEFGHIKLMNPQRSTVWY]+$/i
  return aminoAcidRegex.test(sequence)
}

const BilboMDAlphaFoldJobSchema = object().shape({
  title: string()
    .required('Please provide a title for your BilboMD Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(30, 'Title must contain less than 30 characters.')
    .matches(/^[\w\s-]+$/, 'No spaces or special characters allowed'),

  dat_file: requiredFile('Experimental SAXS data is required')
    .concat(fileSizeTest(2_000_000))
    .concat(fileExtTest('dat'))
    .concat(saxsCheck())
    .concat(noSpacesTest())
    .concat(fileNameLengthTest()),

  entities: array()
    .of(
      object().shape({
        name: string(), // Hidden field, but still required in the object structure
        sequence: string()
          .required('Please provide the sequence.')
          .min(10, 'Sequence must contain at least 10 characters.')
          .test(
            'is-amino-acid-sequence',
            'Invalid character. Allowed characters: A, R, D, C, Q, E, G, H, I, L, K, M, N, F, P, S, T, W, Y, V',
            function (sequence) {
              const { type } = this.parent
              if (type === 'Protein') {
                return isAminoAcidSequence(sequence)
              }
              return true
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
