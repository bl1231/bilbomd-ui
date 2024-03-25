import { mixed, number, object, string } from 'yup'

import { fromCharmmGui, noSpaces, isSaxsData } from './ValidationFunctions'

export const BilboMDClassicJobSchema = object().shape({
  bilbomd_mode: string().required('Selection is required'),
  title: string()
    .required('Please provide a title for your BilboMD Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(20, 'Title must contain less than 20 characters.')
    .matches(/^[\w\s-]+$/, 'no special characters allowed'),
  psf_file: mixed().when('bilbomd_mode', {
    is: 'crd_psf',
    then: () =>
      mixed()
        .test(
          'required',
          'PSF file obtained from CHARMM-GUI is required',
          (file) => (file ? true : false) // Simplified return statement
        )
        .test('file-size-check', 'Max file size is 30MB', (file) => {
          if (file instanceof File && file.size <= 30000000) {
            return true
          }
          return false
        })
        .test(
          'file-type-check',
          'Only accepts a PSF file obtained from CHARMM-GUI',
          (file) => {
            if (
              file instanceof File &&
              file.name.split('.').pop()?.toUpperCase() === 'PSF'
            ) {
              return true
            }
            return false
          }
        )
        .test(
          'charmm-gui-check',
          'File does not appear to be a PSF file output from CHARMM-GUI',
          async (file) => {
            if (file instanceof File) {
              const fromCharmm = await fromCharmmGui(file)
              return fromCharmm
            }
            return false
          }
        )
        .test(
          'check-for-spaces',
          'No spaces allowed in the file name.',
          async (file) => {
            if (file instanceof File) {
              const spaceCheck = await noSpaces(file)
              return spaceCheck
            }
            return false
          }
        ),
    otherwise: () => mixed().notRequired()
  }),

  crd_file: mixed().when('bilbomd_mode', {
    is: 'crd_psf',
    then: () =>
      mixed()
        .test(
          'required',
          'CRD file obtained from CHARMM-GUI is required',
          (file) => {
            if (file) return true
            return false
          }
        )
        .test('file-size-check', 'Max file size is 20MB', (file) => {
          if (file && (file as File).size <= 20000000) {
            // console.log(file.size)
            return true
          }
          // console.log(file.size)
          return false
        })
        .test(
          'file-type-check',
          'Only accepts a CRD file obtained from CHARMM-GUI',
          (file) => {
            if (
              file &&
              (file as File).name.split('.').pop()?.toUpperCase() === 'CRD'
            ) {
              // console.log(file.name.split('.').pop())
              return true
            }
            return false
          }
        )
        .test(
          'charmm-gui-check',
          'File does not appear to be a CRD file output from CHARMM-GUI',
          async (file) => {
            if (file) {
              const fromCharmm = await fromCharmmGui(file as File)
              // console.log('fromCharmm:', fromCharmm)
              return fromCharmm
            }
            // additional return if test fails for reasons other than NOT being a CHARMM file
            return false
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
        ),
    otherwise: () => mixed().notRequired()
  }),
  pdb_file: mixed().when('bilbomd_mode', {
    is: 'pdb',
    then: () =>
      mixed()
        .required('gotta supply a PDB file')
        .test('file-type-check', 'Only accepts a PDB file.', (file) => {
          if (
            file &&
            (file as File).name.split('.').pop()?.toUpperCase() === 'PDB'
          ) {
            // console.log(file.name.split('.').pop())
            return true
          }
          return false
        })
        .test('file-size-check', 'Max file size is 10MB', (file) => {
          if (file && (file as File).size <= 10000000) {
            // console.log(file.size)
            return true
          }
          // console.log(file.size)
          return false
        }),
    otherwise: () => mixed().notRequired()
  }),
  constinp: mixed()
    .test('required', 'A const.inp file is required', (file) => {
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
    .test('file-type-check', 'Only accepts a const.inp file.', (file) => {
      if (
        file &&
        (file as File).name.split('.').pop()?.toUpperCase() === 'INP'
      ) {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test(
      'check-for-spaces',
      'No spaces allowed in the file name.',
      async (file) => {
        if (file) {
          const spaceCheck = await noSpaces(file as File)
          // console.log(spaceCheck)
          return spaceCheck
        }
        return false
      }
    ),
  expdata: mixed()
    .test('required', 'Experimental SAXS data is required', (file) => {
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
    .test('file-type-check', 'Only accepts a *.dat file.', (file) => {
      if (
        file &&
        (file as File).name.split('.').pop()?.toUpperCase() === 'DAT'
      ) {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test(
      'saxs-data-check',
      'File does not appear to be SAXS data',
      async (file) => {
        if (file) {
          const saxsData = await isSaxsData(file as File)
          // console.log('saxsData:', saxsData)
          return saxsData
        }
        // additional return if test fails for reasons other than NOT being SAXS data
        return false
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
    ),

  num_conf: number()
    .integer()
    .oneOf([1, 2, 3, 4])
    .required(
      'Please select a number of Conformations to sample during CHARMM dynamics step'
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
    )
})
