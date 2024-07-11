import { object, string } from 'yup'

export const userProfileSchema = object().shape({
  email: string().email('Please enter a valid email').required('Required'),
  username: string()
    .min(4, 'Username must be at least 4 characters')
    .max(15, 'Username must be less than 15 characters')
    .required('Required')
})
