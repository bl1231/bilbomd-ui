import { mixed } from 'yup'
import {
  noSpaces,
  isSaxsData,
  isValidConstInpFile,
  isPsfData,
  isCRD,
  containsChainId
} from '../ValidationFunctions'

const isFileOrString = (file: unknown): boolean =>
  typeof file === 'string' || file instanceof File

export const fileSizeTest = (maxSize: number) =>
  mixed().test(
    'file-size-check',
    `Max file size is ${maxSize / 1_000_000}MB`,
    (file) => {
      if (file instanceof File) return file.size <= maxSize
      return typeof file === 'string'
    }
  )

export const fileNameLengthTest = () =>
  mixed().test(
    'filename-length-check',
    'Filename must be no longer than 30 characters.',
    (file) => {
      if (file instanceof File) return file.name.length <= 30
      if (typeof file === 'string') return file.length <= 30
      return false
    }
  )

export const noSpacesTest = () =>
  mixed().test(
    'check-for-spaces',
    'No spaces allowed in the file name.',
    async (file) => {
      if (file instanceof File) return noSpaces(file)
      return true // allow string fallback
    }
  )

export const fileExtTest = (ext: string) =>
  mixed().test('file-type-check', `Only accepts a *.${ext} file.`, (file) => {
    if (file instanceof File)
      return file.name.split('.').pop()?.toLowerCase() === ext.toLowerCase()
    return typeof file === 'string'
  })

export const requiredFile = (message: string) =>
  mixed().test('required', message, isFileOrString)

// Specialized file content checks (for async validators)
export const saxsCheck = () =>
  mixed().test(
    'saxs-data-check',
    'File does not appear to be SAXS data',
    async function (file) {
      if (file instanceof File) {
        const result = await isSaxsData(file)
        if (result.valid) return true
        return this.createError({ message: result.message })
      }
      return true // allow string fallback
    }
  )

export const psfCheck = () =>
  mixed().test(
    'psf-data-check',
    'File may not be a valid PSF file',
    async (file) => {
      if (file instanceof File) return isPsfData(file)
      return true
    }
  )

export const crdCheck = () =>
  mixed().test(
    'crd-check',
    'File may not be a valid CRD file',
    async (file) => {
      if (file instanceof File) return isCRD(file)
      return true
    }
  )

export const chainIdCheck = () =>
  mixed().test(
    'pdb-chainid-check',
    'Missing Chain ID in column 22',
    async (file) => {
      if (file instanceof File) return containsChainId(file)
      return true
    }
  )

export const constInpCheck = () =>
  mixed().test('const-inp-file-check', '', async function (file, ctx) {
    const mode = ctx?.options?.context?.bilbomd_mode
    if (file instanceof File) {
      const result = await isValidConstInpFile(file, mode)
      if (result === true) return true
      return this.createError({ message: result })
    }
    return true
  })
