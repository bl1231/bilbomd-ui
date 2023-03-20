import * as Yup from 'yup'
import formModel from './formModel'

const {
  formField: { crd_file }
} = formModel

const fromCharmmGui = (file) => {
  const charmmGui = /CHARMM-GUI/
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      let lines = reader.result.split(/[\r\n]+/g)
      for (let line = 0; line < 5; line++) {
        // console.log(charmmGui.test(lines[line]), 'line', line, lines[line])
        if (charmmGui.test(lines[line])) {
          // console.log(lines[line])
          resolve(true)
        }
      }
      resolve(false)
    }
  })
}

// Array of validationSchema
// Therefore the order must match the order of the multistep forms
const validationSchemas = [
  // File upload
  Yup.object().shape({
    crd_file: Yup.object().shape({
      file: Yup.mixed()
        .test('required', 'CRD file obtained from CHARMM-GUI is required', (file) => {
          if (file) return true
          return false
        })
        .test('file-size-check', 'Max file size is 2MB', (file) => {
          if (file && file.size <= 2000000) {
            console.log('file-size-check:', file.size)
            return true
          }
          return false
        })
        .test(
          'file-type-check',
          'Only accepts a CRD file obtained from CHARMM-GUI',
          (file) => {
            if (file && file.name.split('.').pop().toUpperCase() === 'CRD') {
              console.log('file-type-check1:', file.name.split('.').pop())
              return true
            }
            //console.log('file-type-check2:', file.name.split('.').pop())
            console.log('file-type-check: not a *.CRD file')
            return false
          }
        )
        .test(
          'charmm-gui-check',
          'File does not appear to be a CRD file output from CHARMM-GUI',
          async (file) => {
            if (file) {
              const fromCharmm = await fromCharmmGui(file)
              console.log('fromCharmm:', fromCharmm)
              return fromCharmm
            }
          }
        ),
      name: Yup.string().required(),
      chains: Yup.array()
    })
  }),
  // Define rigid domains
  Yup.object({
    crd_file: Yup.object().shape({
      file: Yup.string().required(),
      src: Yup.string().required(),
      name: Yup.string().required(),
      chains: Yup.array(
        Yup.object().shape({
          id: Yup.string(),
          atoms: Yup.number(),
          first_res: Yup.number(),
          last_res: Yup.number(),
          num_res: Yup.number(),
          domains: Yup.array(
            Yup.object().shape({
              id: Yup.string().max(4),
              start: Yup.number('Please specify a number').required(),
              end: Yup.number('Please specify a number').required()
            })
          ).min(1, 'please prove at least one rigid domain')
        })
      ).min(1, 'Need at least one protein or nucleic acid chain')
    })
  })
]

export default validationSchemas
