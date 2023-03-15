import formModel from './formModel'
const {
  formField: { crdFile }
} = formModel

export default {
  [crdFile.name]: {
    file: null,
    src: null,
    name: ''
  }
}
