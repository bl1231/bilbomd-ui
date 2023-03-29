import * as Yup from 'yup'

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
        .required('Please select a *.crd file')
        .test('required', '*.crd file obtained from CHARMM-GUI is required', (file) => {
          if (file) return true
          return false
        })
        .test('file-size-check', 'Max file size is 2MB', (file) => {
          if (file && file.size <= 2000000) {
            // console.log('file-size:', file.size)
            return true
          }
          return false
        })
        .test(
          'file-type-check',
          'Please obtain and upload a *.crd file from CHARMM-GUI',
          (file) => {
            if (file && file.name.split('.').pop().toUpperCase() === 'CRD') {
              // console.log('file-extension:', file.name.split('.').pop())
              return true
            }
            //console.log('file-type-check2:', file.name.split('.').pop())
            // console.log('file-type-check: not a *.crd file')
            return false
          }
        )
        .test(
          'charmm-gui-check',
          'File does not appear to be a *.crd file output from CHARMM-GUI',
          async (file) => {
            if (file) {
              const fromCharmm = await fromCharmmGui(file)
              // console.log('fromCharmm:', fromCharmm)
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
              start: Yup.number('')
                .typeError('Must be a number')
                .integer('Integer values only')
                .positive('Positive values only')
                .required('Please provide start residue')
                .test(
                  'check-valid-start-end-res',
                  'Please choose number between chain start and end residue',
                  (value, ctx) => {
                    // Tricky stuff to find where parent values stored.
                    const chainStart = ctx.from[1].value.first_res
                    const chainEnd = ctx.from[1].value.last_res
                    //console.log(ctx)
                    if (value >= chainStart && value <= chainEnd) {
                      return true
                    }
                    return false
                  }
                )
                .test(
                  'check-for-overlap',
                  'Please select residue not already in another domain',
                  (value, ctx) => {
                    const numDomains = ctx.from[1].value.domains.length
                    const domains = ctx.from[1].value.domains

                    for (let idx = 0; idx < numDomains; idx++) {
                      // skip validating against itself
                      if (ctx.options.index === idx) {
                        continue
                      }
                      if (domains[idx].start <= value && value <= domains[idx].end) {
                        return false
                      }
                    }
                    return true
                  }
                ),
              end: Yup.number('')
                .typeError('Must be a number.')
                .integer('Integer values only')
                .positive('Positive values only')
                .moreThan(Yup.ref('start'), 'End should be greater than start')
                .required('Please provide end residue')
                .test(
                  'check-valid-start-end-res',
                  'Please choose number between chain start and end residue',
                  (value, ctx) => {
                    const chainStart = ctx.from[1].value.first_res
                    const chainEnd = ctx.from[1].value.last_res
                    //console.log(JSON.stringify(chainStart, null, 2))
                    if (value >= chainStart && value <= chainEnd) {
                      return true
                    }
                    return false
                  }
                )
                .test(
                  'check-for-overlap',
                  'Please select residue not already in another domain',
                  (value, ctx) => {
                    const numDomains = ctx.from[1].value.domains.length
                    const domains = ctx.from[1].value.domains

                    for (let idx = 0; idx < numDomains; idx++) {
                      // skip validating against itself
                      if (ctx.options.index === idx) {
                        continue
                      }
                      if (domains[idx].start <= value && value <= domains[idx].end) {
                        return false
                      }
                    }
                    return true
                  }
                )
            })
          ).min(0, 'please prove at least one rigid domain')
        })
      ).min(1, 'Need at least one protein or nucleic acid chain')
    })
  })
]

export default validationSchemas