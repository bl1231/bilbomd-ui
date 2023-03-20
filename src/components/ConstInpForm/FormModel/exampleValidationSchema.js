import * as Yup from 'yup'
//import moment from "moment";
import checkoutFormModel from './checkoutFormModel'
const {
  formField: {
    gender,
    age,
    rate,
    symptomCategory,
    symptomDetail,
    reasonCategory,
    reasonDetail,
    image,
    firstName,
    lastName,
    email,
    phone,
    address1,
    city,
    zipcode,
    country
  }
} = checkoutFormModel

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const FILE_SIZE = 10 * 1024 * 1024 // = 10 MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']

const valArray = [
  Yup.object().shape({}), // Welcome form
  // General Info
  Yup.object().shape({
    [gender.name]: Yup.string().required(`${gender.requiredErrorMsg}`),
    [age.name]: Yup.string().required(`${age.requiredErrorMsg}`),
    [rate.name]: Yup.string().required(`${rate.requiredErrorMsg}`)
  }),
  //Simple checkbox
  Yup.object().shape({
    [symptomCategory.name]: Yup.array()
      .of(Yup.string())
      .required(`${symptomCategory.requiredErrorMsg}`),
    [symptomDetail.name]: Yup.string().nullable()
  }),
  // Conditional ceckbox group
  Yup.object().shape({
    [reasonCategory.name]: Yup.array()
      .of(Yup.string())
      .required(`${reasonCategory.requiredErrorMsg}`),
    [reasonDetail.name]: Yup.string().when(`${reasonCategory.name}`, (value) => {
      //console.log(value);
      if (value.length) {
        return value.includes(`${reasonCategory.conditionalValue}`)
          ? Yup.string().required()
          : Yup.string().nullable()
      }
    }) //required(
  }),

  // Upload
  Yup.object().shape({
    [image.name]: Yup.mixed()
      .required('A file is required')
      .test('isEmpty', `${image.requiredErrorMsg}`, (value) => value && value.file)
      .test(
        'fileSize',
        'File too large',
        (value) => value && value.file && value.file.size <= FILE_SIZE
      )
      .test(
        'fileFormat',
        'Unsupported Format',
        (value) => value && value.file && SUPPORTED_FORMATS.includes(value.file.type)
      )
    // .required("A file is required"),
  }),

  Yup.object().shape({
    // Client info
    [firstName.name]: Yup.string().required(`${firstName.requiredErrorMsg}`),
    [lastName.name]: Yup.string().required(`${lastName.requiredErrorMsg}`),
    [email.name]: Yup.string().email().required(`${email.requiredErrorMsg}`),
    [phone.name]: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required(`${phone.requiredErrorMsg}`)
  }),
  Yup.object().shape({
    [address1.name]: Yup.string().required(`${address1.requiredErrorMsg}`),
    [city.name]: Yup.string().nullable().required(`${city.requiredErrorMsg}`),
    [zipcode.name]: Yup.string()
      .required(`${zipcode.requiredErrorMsg}`)
      .test('len', `${zipcode.invalidErrorMsg}`, (val) => val && val.length === 5),
    [country.name]: Yup.string().nullable().required(`${country.requiredErrorMsg}`)
  })
]

export default valArray
