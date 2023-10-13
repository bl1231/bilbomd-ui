import { mixed, boolean, number, object, string } from 'yup'

const fromCharmmGui = (file: File): Promise<boolean> => {
  const charmmGui = /CHARMM-GUI/
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/g)
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

const isSaxsData = (file: File): Promise<boolean> => {
  const sciNotation = /-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/g)
      for (let line = 0; line < 5; line++) {
        // console.log(charmmGui.test(lines[line]), 'line', line, lines[line])
        if (sciNotation.test(lines[line])) {
          // console.log('LINE: ', lines[line])
          const arr = lines[line].match(sciNotation)
          // console.log(arr)
          // console.log(arr.length)
          if (arr && arr.length === 3) {
            resolve(true)
          }
        }
      }
      resolve(false)
    }
  })
}

const noSpaces = (file: File): Promise<boolean> => {
  const spaces = /\s/
  return new Promise((resolve) => {
    if (spaces.test(file.name)) {
      // console.log('false', file.name)
      resolve(false)
    }
    resolve(true)
  })
}

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
  title: string()
    .required('Please provide a title for your BilboMD Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(20, 'Title must contain less than 20 characters.')
    .matches(/^[\w\s-]+$/, 'no special characters allowed'),
  psf_file: mixed()
    .test('required', 'PSF file obtained from CHARMM-GUI is required', (file) => {
      if (file) return true
      return false
    })
    .test('file-size-check', 'Max file size is 30MB', (file) => {
      if (file && (file as File).size <= 30000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test(
      'file-type-check',
      'Only accepts a PSF file obtained from CHARMM-GUI',
      (file) => {
        if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'PSF') {
          // console.log(file.name.split('.').pop())
          return true
        }
        return false
      }
    )
    .test(
      'charmm-gui-check',
      'File does not appear to be a PSF file output from CHARMM-GUI',
      async (file) => {
        if (file) {
          const fromCharmm = await fromCharmmGui(file as File)
          // console.log('fromCharmm:', fromCharmm)
          return fromCharmm
        }
        // additional return if test fails for reasons other than NOT being a CHARMM file
        return false
      }
    )
    .test('check-for-spaces', 'No spaces allowed in the file name.', async (file) => {
      if (file) {
        const spaceCheck = await noSpaces(file as File)
        // console.log(spaceCheck)
        return spaceCheck
      }
      return false
    }),
  crd_file: mixed()
    .test('required', 'CRD file obtained from CHARMM-GUI is required', (file) => {
      if (file) return true
      return false
    })
    .test('file-size-check', 'Max file size is 20MB', (file) => {
      if (file && (file as File).size <= 20000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test(
      'file-type-check',
      'Only accepts a CRD file obtained from CHARMM-GUI',
      (file) => {
        if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'CRD') {
          // console.log(file.name.split('.').pop())
          return true
        }
        return false
      }
    )
    .test(
      'charmm-gui-check',
      'File does not appear to be a CRD file output from CHARMM-GUI',
      async (file) => {
        if (file) {
          const fromCharmm = await fromCharmmGui(file as File)
          // console.log('fromCharmm:', fromCharmm)
          return fromCharmm
        }
        // additional return if test fails for reasons other than NOT being a CHARMM file
        return false
      }
    )
    .test(
      'check-for-spaces',
      'Only accept file with no spaces in the name.',
      async (file) => {
        if (file) {
          const spaceCheck = await noSpaces(file as File)
          // console.log(spaceCheck)
          return spaceCheck
        }
        return false
      }
    ),
  constinp: mixed()
    .test('required', 'A const.inp file is required', (file) => {
      if (file) return true
      return false
    })
    .test('file-size-check', 'Max file size is 2MB', (file) => {
      if (file && (file as File).size <= 2000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('file-type-check', 'Only accepts a const.inp file.', (file) => {
      if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'INP') {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test('check-for-spaces', 'No spaces allowed in the file name.', async (file) => {
      if (file) {
        const spaceCheck = await noSpaces(file as File)
        // console.log(spaceCheck)
        return spaceCheck
      }
      return false
    }),
  expdata: mixed()
    .test('required', 'Experimental SAXS data is required', (file) => {
      if (file) return true
      return false
    })
    .test('file-size-check', 'Max file size is 2MB', (file) => {
      if (file && (file as File).size <= 2000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('file-type-check', 'Only accepts a *.dat file.', (file) => {
      if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'DAT') {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test('saxs-data-check', 'File does not appear to be SAXS data', async (file) => {
      if (file) {
        const saxsData = await isSaxsData(file as File)
        // console.log('saxsData:', saxsData)
        return saxsData
      }
      // additional return if test fails for reasons other than NOT being SAXS data
      return false
    })
    .test(
      'check-for-spaces',
      'Only accept file with no spaces in the name.',
      async (file) => {
        if (file) {
          const spaceCheck = await noSpaces(file as File)
          // console.log(spaceCheck)
          return spaceCheck
        }
        return false
      }
    ),

  num_conf: number()
    .integer()
    .oneOf([1, 2, 3, 4])
    .required(
      'Please select a number of Conformations to sample during CHARMM dynamics step'
    ),
  rg_min: number()
    .integer()
    .positive()
    .min(10)
    .max(100)
    .required('Please provide a Minimum Rg value'),
  rg_max: number()
    .integer()
    .positive()
    .min(10)
    .max(100)
    .required('Please provide a Maximum Rg value')
})
export const expdataSchema = mixed()
  .test('required', 'Experimental SAXS data is required', (file) => {
    if (file) return true
    return false
  })
  .test('file-size-check', 'Max file size is 2MB', (file) => {
    if (file && (file as File).size <= 2000000) {
      // console.log(file.size)
      return true
    }
    // console.log(file.size)
    return false
  })
  .test('file-type-check', 'Only accepts a *.dat file.', (file) => {
    if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'DAT') {
      // console.log(file.name.split('.').pop())
      return true
    }
    return false
  })
  .test('saxs-data-check', 'File does not appear to be SAXS data', async (file) => {
    if (file) {
      const saxsData = await isSaxsData(file as File)
      // console.log('saxsData:', saxsData)
      return saxsData
    }
    // additional return if test fails for reasons other than NOT being SAXS data
    return false
  })
  .test(
    'check-for-spaces',
    'Only accept file with no spaces in the name.',
    async (file) => {
      if (file) {
        const spaceCheck = await noSpaces(file as File)
        // console.log(spaceCheck)
        return spaceCheck
      }
      return false
    }
  )
export const editUserSchema = object().shape({
  active: boolean()
})
export const af2paeJiffySchema = object().shape({
  crd_file: mixed()
    .required('CRD file obtained from CHARMM-GUI is required')
    .test('file-size-check', 'Max file size is 20MB', (file) => {
      if (file && (file as File).size <= 20000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test(
      'file-type-check',
      'Only accepts a CRD file obtained from CHARMM-GUI',
      (file) => {
        if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'CRD') {
          // console.log(file.name.split('.').pop())
          return true
        }
        return false
      }
    )
    .test(
      'charmm-gui-check',
      'File does not appear to be a CRD file output from CHARMM-GUI',
      async (file) => {
        if (file) {
          const fromCharmm = await fromCharmmGui(file as File)
          // console.log('fromCharmm:', fromCharmm)
          return fromCharmm
        }
        // additional return if test fails for reasons other than NOT being a CHARMM file
        return false
      }
    )
    .test('check-for-spaces', 'No spaces allowed in filename.', async (file) => {
      if (file) {
        const spaceCheck = await noSpaces(file as File)
        // console.log(spaceCheck)
        return spaceCheck
      }
      return false
    }),
  pae_file: mixed()
    .required('PAE file in JSON format is required')
    .test('is-json', 'Invalid JSON format', (file) => {
      if (file && file instanceof File && file.type === 'application/json') {
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = () => {
            try {
              const content = reader.result as string // Explicit type cast to string
              JSON.parse(content) // Try to parse the content as JSON
              resolve(true) // Content is valid JSON
            } catch (error) {
              resolve(false) // Content is not valid JSON
            }
          }

          reader.onerror = () => {
            resolve(false) // Unable to read the content
          }
          reader.readAsText(file)
        })
      }
      return false
    })
    .test('file-size-check', 'Max file size is 40MB', (file) => {
      if (file && (file as File).size <= 40000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('file-type-check', 'Only accepts a JSON file', (file) => {
      if (file && (file as File).name.split('.').pop()?.toUpperCase() === 'JSON') {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test('check-for-spaces', 'No spaces allowed in filename.', async (file) => {
      if (file) {
        const spaceCheck = await noSpaces(file as File)
        // console.log(spaceCheck)
        return spaceCheck
      }
      return false
    })
})
