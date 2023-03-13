//import * as yup from 'yup';

import { mixed, boolean, number, object, string, ValidationError } from 'yup'

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
export const bilbomdJobSchema = object().shape({
  title: string()
    .required('Please provide a title for your BilboMD Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(20, 'Title must contain less than 20 characters.')
    .matches(/^[\w\s-]+$/, 'no special characters allowed'),

  // psf_file: string()
  //   .required('PSF file obtained from CHARMM-GUI is required')
  //   .matches(/^[\w]+(\.psf)$/, 'Upload a *.psf file only'),
  psf_file: mixed()
    .test('required', 'PSF file obtained from CHARMM-GUI is required', (file) => {
      if (file) return true
      return false
    })
    .test('fileSize', 'Max file size is 2MB', (file) => {
      if (file && file.size <= 2000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('fileType', 'Only accepts a PSF file obtained from CHARMM-GUI', (file) => {
      if (file && file.name.split('.').pop().toUpperCase() === 'PSF') {
        console.log(file.name.split('.').pop())
        return true
      }
      return false
    }),
  crd_file: mixed()
    .test('required', 'CRD file obtained from CHARMM-GUI is required', (file) => {
      if (file) return true
      return false
    })
    .test('fileSize', 'Max file size is 2MB', (file) => {
      if (file && file.size <= 2000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('fileType', 'Only accepts a CRD file obtained from CHARMM-GUI', (file) => {
      if (file && file.name.split('.').pop().toUpperCase() === 'CRD') {
        console.log(file.name.split('.').pop())
        return true
      }
      return false
    }),
  constinp: mixed()
    .test('required', 'A const.inp file is required', (file) => {
      if (file) return true
      return false
    })
    .test('fileSize', 'Max file size is 2MB', (file) => {
      if (file && file.size <= 2000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('fileType', 'Only accepts a const.inp file.', (file) => {
      if (file && file.name.split('.').pop().toUpperCase() === 'INP') {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    }),
  expdata: mixed()
    .test('required', 'Experimental SAXS data is required', (file) => {
      if (file) return true
      return false
    })
    .test('fileSize', 'Max file size is 2MB', (file) => {
      if (file && file.size <= 2000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('fileType', 'Only accepts a *.dat file.', (file) => {
      if (file && file.name.split('.').pop().toUpperCase() === 'DAT') {
        console.log(file.name.split('.').pop())
        return true
      }
      return false
    }),

  num_conf: number()
    .integer()
    .oneOf([1, 2, 3, 4])
    .required(
      'Please select a number of Conformations to sample during CHARMM dynamics step'
    ),
  rg_min: number('Please specify a number')
    .integer()
    .positive()
    .min(10)
    .max(100)
    .required('Please provide a Minimum Rg value'),
  rg_max: number('Please specify a number')
    .integer()
    .positive()
    .min(10)
    .max(100)
    .required('Please provide a Maximum Rg value')
})
export const editUserSchema = object().shape({
  active: boolean()
})
