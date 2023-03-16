import formModel from './formModel'

const {
  formField: { crdFile, domains }
} = formModel

const initialValues = {
  [crdFile.name]: {
    file: null,
    src: null,
    name: '',
    chains: [
      {
        id: '',
        atoms: '',
        first_res: '',
        last_res: '',
        num_res: ''
      }
    ]
  },
  [domains.name]: [
    {
      id: '',
      start: '',
      end: ''
    }
  ]
}

export default initialValues
