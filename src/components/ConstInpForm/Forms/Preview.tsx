import { useState, useEffect } from 'react'
import { useFormikContext, FormikValues } from 'formik'
import { Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import CopyToClipboardButton from 'components/Common/CopyToClipboardButton'
import Download from '../Helpers/Download'
import { RigidBody } from 'types/interfaces'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary,
  display: 'flex',
  flex: '1 1 100%',
  flexDirection: 'column'
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px'
}

const Preview = () => {
  useTitle('BilboMD: Preview const.inp file')
  const [constFilePreview, setConstFilePreview] = useState('')
  const [constFileBlob, setConstFileBlob] = useState<Blob | null>(null)
  const { values } = useFormikContext<FormikValues>()
  const rigid_bodies = values.crd_file.rigid_bodies as RigidBody[]

  const prepareConstInputFile = (rigidBodies: RigidBody[]) => {
    const contentArray: string[] = []
    let dockCount = 1
    let rigidCount = 1
    rigidBodies.map((rb) => {
      if (rb.id === 'PRIMARY') {
        const rigid_domains: string[] = []
        rb.domains.map(({ chainid, start, end }, d_index) => {
          const rd_index = d_index + 1

          const line =
            'define fixed' +
            rd_index +
            ' sele ( resid ' +
            start +
            ':' +
            end +
            ' .and. segid ' +
            chainid +
            ' ) ' +
            'end'
          contentArray.push(line)
          rigid_domains.push('fixed' + rd_index, '.or.')
        })

        rigid_domains.pop()
        rigid_domains.push('end')
        contentArray.push('cons fix sele ' + rigid_domains.join(' '))
        contentArray.push(' ')
      } else {
        const rigid_domains: string[] = []
        rb.domains.map(({ chainid, start, end }) => {
          // const rd_index = d_index + rigidCount
          const line =
            'define rigid' +
            rigidCount +
            ' sele ( resid ' +
            start +
            ':' +
            end +
            ' .and. segid ' +
            chainid +
            ' ) ' +
            'end'
          contentArray.push(line)
          rigid_domains.push('rigid' + rigidCount, '.or.')
          rigidCount++
        })
        rigid_domains.pop()
        rigid_domains.push('end')
        contentArray.push(
          'shape desc dock' + dockCount + ' rigid sele ' + rigid_domains.join(' ')
        )
        contentArray.push(' ')
        dockCount++
      }
    })
    contentArray.push('return')
    const content = contentArray.join('\n')
    setConstFilePreview(content)
    const file = new Blob([content], { type: 'text/plain' })
    setConstFileBlob(file)
  }

  useEffect(() => {
    if (values) {
      prepareConstInputFile(rigid_bodies)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  return (
    <>
      <Grid container>
        <Grid item>
          <Typography sx={HeaderThingee}>Preview</Typography>
          <Item>
            <Typography sx={{ my: 3 }}>
              This is the <code>const.inp</code> definition file with your Rigid Bodies
              and defined in a format that CHARMM will understand. You can either copy and
              paste the file shown below or, if you prefer, you can use the Download
              button.
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <Grid
                item
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2,
                  m: 1,
                  backgroundColor: '#bae0ff', //blue-2
                  borderRadius: 1,
                  // alignItems: 'center',
                  flex: '0 1 100%'
                  // justifyContent: 'space-between'
                }}
              >
                <Box sx={{ alignSelf: 'end' }}>
                  <CopyToClipboardButton text={constFilePreview} />
                </Box>

                <pre>
                  <code>{constFilePreview}</code>
                </pre>
              </Grid>
            </Box>
            <Download file={constFileBlob} />
          </Item>
        </Grid>
      </Grid>
    </>
  )
}

export { Preview }
