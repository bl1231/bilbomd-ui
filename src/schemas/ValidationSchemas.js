//import * as yup from 'yup';
import { array, boolean, number, object, string, ValidationError } from 'yup'

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
  title: string().required('Please provide a title for your BilboMD Job.').min(4).max(20),
  pdbs: array(object({ uuid: string() }))
    .min(1, 'upload at least one PDB')
    .max(3),
  constinp: string().required('const.inp is required'),
  expdata: string().required('experimental data is required'),
  num_conf: number()
    .integer()
    .oneOf([1, 2, 3, 4])
    .required('Please select a number of Conformations to sample'),
  rg_min: number()
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
