import { mixed, number, object, string } from 'yup'
import {
  requiredFile,
  fileExtTest,
  fileSizeTest,
  fileNameLengthTest,
  noSpacesTest,
  saxsCheck,
  psfCheck,
  crdCheck,
  chainIdCheck,
  constInpCheck
} from './fieldTests/fieldTests'

const BilboMDClassicJobSchema = object().shape({
  bilbomd_mode: string().required('Selection is required'),
  title: string()
    .required('Please provide a title for your BilboMD Job.')
    .min(4, 'Title must contain at least 4 characters.')
    .max(24, 'Title must contain less than 24 characters.')
    .matches(/^[\w\s-]+$/, 'no spaces or special characters allowed'),
  psf_file: mixed().when('bilbomd_mode', {
    is: 'crd_psf',
    then: () =>
      requiredFile('A PSF file is required')
        .concat(fileSizeTest(30_000_000))
        .concat(fileExtTest('psf'))
        .concat(noSpacesTest())
        .concat(fileNameLengthTest())
        .concat(psfCheck()),
    otherwise: () => mixed().notRequired()
  }),
  crd_file: mixed().when('bilbomd_mode', {
    is: 'crd_psf',
    then: () =>
      requiredFile('A CRD file is required')
        .concat(fileSizeTest(20_000_000))
        .concat(fileExtTest('crd'))
        .concat(noSpacesTest())
        .concat(fileNameLengthTest())
        .concat(crdCheck()),
    otherwise: () => mixed().notRequired()
  }),
  pdb_file: mixed().when('bilbomd_mode', {
    is: 'pdb',
    then: () =>
      requiredFile('A PDB file is required')
        .concat(chainIdCheck())
        .concat(fileExtTest('pdb'))
        .concat(fileSizeTest(10_000_000))
        .concat(noSpacesTest())
        .concat(fileNameLengthTest()),
    otherwise: () => mixed().notRequired()
  }),
  inp_file: mixed()
    .concat(requiredFile('A CONST.INP file is required'))
    .concat(constInpCheck())
    .concat(fileSizeTest(2_000_000))
    .concat(fileExtTest('inp'))
    .concat(noSpacesTest())
    .concat(fileNameLengthTest()),
  dat_file: mixed()
    .concat(requiredFile('A SAXS data file is required'))
    .concat(fileSizeTest(2_000_000))
    .concat(fileExtTest('dat'))
    .concat(saxsCheck())
    .concat(noSpacesTest())
    .concat(fileNameLengthTest()),
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
    .test(
      'is-greater',
      'Rg Maximum must be at least 1 Å greater than Rg Minimum',
      function (value) {
        const { rg_min } = this.parent
        return value > rg_min
      }
    )
})

export { BilboMDClassicJobSchema }
