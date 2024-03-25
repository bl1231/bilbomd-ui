import { mixed, boolean, object, string } from 'yup'

import { noSpaces, isSaxsData } from './ValidationFunctions'

export const userRegisterSchema = object().shape({
  email: string().email('Please enter a valid email').required('Required'),
  user: string()
    .min(4, 'Username must be at least 4 characters')
    .max(15, 'Username must be less than 15 characters')
    .required('Required')
})

export const userSignInSchema = object().shape({
  email: string().email('Please enter a valid email').required('Required')
})

export const expdataSchema = mixed()
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
    if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'DAT') {
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
  )

export const editUserSchema = object().shape({
  active: boolean()
})
