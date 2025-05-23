import { mixed, object, string, number, TestContext } from 'yup'
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
  pdb_file: mixed()
    .required('PDB file is required')
    .test('file-size-check', 'Max file size is 20MB', (file) => {
      if (file && (file as File).size <= 20000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('file-type-check', 'Only accepts a PDB file', (file) => {
      if (
        file &&
        (file as File).name.split('.').pop()?.toUpperCase() === 'PDB'
      ) {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test(
      'check-for-spaces',
      'No spaces allowed in filename.',
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
    ),
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
      async function (this: TestContext, file) {
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
  rg_min: number()
    .integer()
    .positive()
    .min(10)
    .max(100)
    .required('Please provide a Minimum Rg value'),
  rg_max: number()
    .integer()
    .positive()
    .min(10)
    .max(100)
    .required('Please provide a Maximum Rg value')
    .test(
      'is-greater',
      'Rg Maximum must be at least 1 Å greater than Rg Minimum',
      function (value) {
        const { rg_min } = this.parent
        return value > rg_min
      }
    ),
  inp_file: mixed()
    .required('const.inp file is required')
    .test('file-size-check', 'Max file size is 2MB', (file) => {
      return file && (file as File).size <= 2000000
    })
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
  d2o_fraction: number()
    .min(0, 'D2O Fraction cannot be less than 0')
    .max(100, 'D2O Fraction cannot be more than 100')
    .required('D2O Fraction is required')
})

export { BilboMDSANSJobSchema }
