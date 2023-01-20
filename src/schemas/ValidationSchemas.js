//import * as yup from 'yup';
import { array, boolean, number, object, string, ValidationError } from 'yup';

export const userRegisterSchema = object().shape({
  email: string().email('Please enter a valid email').required('Required'),
  user: string()
    .min(4, 'Username must be at least 4 characters')
    .max(15, 'Username must be less than 15 characters')
    .required('Required')
});
export const userSignInSchema = object().shape({
  email: string().email('Please enter a valid email').required('Required')
});
export const bilbomdJobSchema = object().shape({
  title: string().required('Please provide a title for your BilboMD Job.').min(4).max(20),
  files: array(object({ url: string() }))
    .min(1, 'upload at least one PDB')
    .max(3),
  constinp: string().required(),
  expdata: string().required(),
  num_conf: number().integer().min(200).max(800).required(),
  rg_min: number().integer().positive().min(10).max(100).required(),
  rg_max: number().integer().positive().min(10).max(100).required()
});
