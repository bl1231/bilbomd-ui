import { FormikConsumer } from 'formik'
import { useTheme } from '@mui/material/styles'
import { blue, green } from '@mui/material/colors'

// Utility function to add newline every 80 characters
const addNewlines = (str: string, everyN: number) => {
  const regex = new RegExp(`(.{1,${everyN}})`, 'g')
  return str.match(regex)?.join('\n') || str
}

// Custom stringify function to handle newlines
const customStringify = (obj: unknown, indent: number = 2) => {
  let json = JSON.stringify(obj, null, indent)
  // Replace escaped newlines with actual newlines
  json = json.replace(/\\n/g, '\n')
  return json
}

const summarizeFileField = (file: File | string | undefined) => {
  if (typeof file === 'string') return file
  if (file instanceof File) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      src: 'Omitted for brevity'
    }
  }
  return undefined
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
          const valuesWithModifiedPdbFile = {
            ...rest.values,
            pdb_file: summarizeFileField(rest.values.pdb_file)
          }

          // Check if entities exist before attempting to modify them
          const entitiesWithModifiedSequences =
            valuesWithModifiedPdbFile.entities
              ? valuesWithModifiedPdbFile.entities.map(
                  (entity: { sequence: string }) => ({
                    ...entity,
                    sequence:
                      entity.sequence.length > 80
                        ? addNewlines(entity.sequence, 80)
                        : entity.sequence
                  })
                )
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
