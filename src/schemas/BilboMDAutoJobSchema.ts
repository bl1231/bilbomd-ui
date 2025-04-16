import { mixed, object, string } from 'yup'
import {
  requiredFile,
  fileExtTest,
  fileSizeTest,
  fileNameLengthTest,
  noSpacesTest,
  saxsCheck,
  chainIdCheck,
  jsonFileCheck
} from './fieldTests/fieldTests'

const BilboMDAutoJobSchema = object().shape({
  title: string()
    .required('Please provide a title for your BilboMD Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(30, 'Title must contain less than 30 characters.')
    .matches(/^[\w\s-]+$/, 'no spaces or special characters allowed'),
  pdb_file: mixed().when('bilbomd_mode', {
    is: 'auto',
    then: () =>
      requiredFile('A PDB file is required')
        .concat(chainIdCheck())
        .concat(fileExtTest('pdb'))
        .concat(fileSizeTest(10_000_000))
        .concat(noSpacesTest())
        .concat(fileNameLengthTest()),
    otherwise: () => mixed().notRequired()
  }),
  pae_file: mixed().when('bilbomd_mode', {
    is: 'auto',
    then: () =>
      requiredFile('A PAE *.json file is required')
        .concat(jsonFileCheck())
        .concat(fileExtTest('json'))
        .concat(fileSizeTest(120_000_000))
        .concat(noSpacesTest())
        .concat(fileNameLengthTest()),
    otherwise: () => mixed().notRequired()
  }),
  data_file: mixed().when('bilbomd_mode', {
    is: 'auto',
    then: () =>
      requiredFile('Experimental SAXS data is required')
        .concat(saxsCheck())
        .concat(fileExtTest('dat'))
        .concat(fileSizeTest(2_000_000))
        .concat(noSpacesTest())
        .concat(fileNameLengthTest()),
    otherwise: () => mixed().notRequired()
  })
})

export { BilboMDAutoJobSchema }
