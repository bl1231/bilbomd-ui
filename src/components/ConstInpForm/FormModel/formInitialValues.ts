import formModel from './formModel'

const {
  formField: { pdb_file }
} = formModel

const initialValues = {
  [pdb_file.name]: {
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
        type: '',
        domains: [
          {
            start: '',
            end: ''
          }
        ]
      }
    ],
    rigid_bodies: [
      {
        id: '',
        domains: [
          {
            chainid: '',
            start: '',
            end: ''
          }
        ]
      }
    ]
  }
}

export default initialValues
