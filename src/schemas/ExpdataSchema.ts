import {
  requiredFile,
  fileExtTest,
  fileSizeTest,
  fileNameLengthTest,
  noSpacesTest,
  saxsCheck
} from './fieldTests/fieldTests'

const expdataSchema = requiredFile('Experimental SAXS data is required')
  .concat(saxsCheck())
  .concat(fileExtTest('dat'))
  .concat(fileSizeTest(2_000_000))
  .concat(noSpacesTest())
  .concat(fileNameLengthTest())

export { expdataSchema }
