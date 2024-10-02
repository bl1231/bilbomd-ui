import { FormikConsumer } from 'formik'
import { useTheme } from '@mui/material/styles'
import { blue, green } from '@mui/material/colors'

// Utility function to add newline every 80 characters
const addNewlines = (str: string, everyN: number) => {
  const regex = new RegExp(`(.{1,${everyN}})`, 'g')
  return str.match(regex)?.join('\n') || str
}

// Custom stringify function to handle newlines
const customStringify = (obj, indent: number = 2) => {
  let json = JSON.stringify(obj, null, indent)
  // Replace escaped newlines with actual newlines
  json = json.replace(/\\n/g, '\n')
  return json
}

export const Debug = () => {
  const theme = useTheme()
  return (
    <div
      style={{
        margin: '3rem 1rem',
        borderRadius: 4,
        maxWidth: '100%'
      }}
    >
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: 12,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          fontWeight: 500,
          padding: '.5rem',
          background: '#555',
          letterSpacing: '1px'
        }}
      >
        Formik State
      </div>
      <FormikConsumer>
        {({ ...rest }) => {
          // Check if pdb_file exists before attempting to modify it
          const pdbFileExists = !!rest.values.pdb_file
          const valuesWithModifiedPdbFile = pdbFileExists
            ? {
                ...rest.values,
                pdb_file: {
                  // Copy all properties except 'src'
                  ...rest.values.pdb_file,
                  src: 'Omitted for brevity' // Replace 'src' with a placeholder
                }
              }
            : rest.values // Use the original values if pdb_file doesn't exist

          // Check if entities exist before attempting to modify them
          const entitiesWithModifiedSequences =
            valuesWithModifiedPdbFile.entities
              ? valuesWithModifiedPdbFile.entities.map((entity) => ({
                  ...entity,
                  sequence:
                    entity.sequence.length > 80
                      ? addNewlines(entity.sequence, 80)
                      : entity.sequence
                }))
              : undefined // Keep entities undefined if they don't exist

          const displayContent = {
            ...rest,
            values: {
              ...valuesWithModifiedPdbFile,
              ...(entitiesWithModifiedSequences && {
                entities: entitiesWithModifiedSequences
              })
            }
          }

          return (
            <pre
              style={{
                fontSize: '.85rem',
                padding: '.25rem .5rem',
                backgroundColor:
                  theme.palette.mode === 'light' ? green[50] : green[900],
                color: theme.palette.mode === 'light' ? blue[900] : blue[100],
                maxWidth: '100%',
                overflowX: 'auto',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {customStringify(displayContent, 3)}
            </pre>
          )
        }}
      </FormikConsumer>
    </div>
  )
}
