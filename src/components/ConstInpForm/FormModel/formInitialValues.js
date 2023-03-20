import formModel from './formModel'

const {
  formField: { crd_file, domains }
} = formModel

const initialValues = {
  [crd_file.name]: {
    file: null,
    src: null,
    name: '',
    chains: [
      {
        id: '',
        atoms: '',
        first_res: '',
        last_res: '',
        num_res: '',
        domains: [
          {
            id: '',
            start: '',
            end: ''
          }
        ]
      }
    ]
  }
}

export default initialValues
