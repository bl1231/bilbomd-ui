import { mixed, object } from 'yup'
import { noSpaces } from './ValidationFunctions'

export const af2paeJiffySchema = object().shape({
  pdb_file: mixed()
    .required('PDB file is required')
    .test('file-size-check', 'Max file size is 20MB', (file) => {
      if (file && (file as File).size <= 20000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('file-type-check', 'Only accepts a PDB file', (file) => {
      if (
        file &&
        (file as File).name.split('.').pop()?.toUpperCase() === 'PDB'
      ) {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test(
      'check-for-spaces',
      'No spaces allowed in filename.',
      async (file) => {
        if (file) {
          const spaceCheck = await noSpaces(file as File)
          // console.log(spaceCheck)
          return spaceCheck
        }
        return false
      }
    )
    .test(
      'filename-length-check',
      'Filename must be no longer than 30 characters.',
      (file) => {
        if (file && (file as File).name.length <= 30) {
          return true
        }
        return false
      }
    ),
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    .test('file-size-check', 'Max file size is 140MB', (file) => {
      if (file && (file as File).size <= 140000000) {
        // console.log(file.size)
        return true
      }
      // console.log(file.size)
      return false
    })
    .test('file-type-check', 'Only accepts a JSON file', (file) => {
      if (
        file &&
        (file as File).name.split('.').pop()?.toUpperCase() === 'JSON'
      ) {
        // console.log(file.name.split('.').pop())
        return true
      }
      return false
    })
    .test(
      'check-for-spaces',
      'No spaces allowed in filename.',
      async (file) => {
        if (file) {
          const spaceCheck = await noSpaces(file as File)
          // console.log(spaceCheck)
          return spaceCheck
        }
        return false
      }
    )
    .test(
      'filename-length-check',
      'Filename must be no longer than 30 characters.',
      (file) => {
        if (file && (file as File).name.length <= 30) {
          return true
        }
        return false
      }
    )
})
