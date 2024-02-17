import { FormikConsumer } from 'formik'
import { useTheme } from '@mui/material/styles'
import { blue, green } from '@mui/material/colors'

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
          // Optionally omit 'src' from the debug output for brevity
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { src, ...restWithoutSrc } = rest.values.pdb_file
          const displayContent = {
            ...rest,
            values: {
              ...rest.values,
              pdb_file: { ...restWithoutSrc, src: 'Omitted for brevity' }
            }
          }

          return (
            <pre
              style={{
                fontSize: '.85rem',
                padding: '.25rem .5rem',
                backgroundColor: theme.palette.mode === 'light' ? green[50] : green[900],
                color: theme.palette.mode === 'light' ? blue[900] : blue[100],
                maxWidth: '100%',
                overflowX: 'auto',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {JSON.stringify(displayContent, null, 3)}
            </pre>
          )
        }}
      </FormikConsumer>
    </div>
  )
}
