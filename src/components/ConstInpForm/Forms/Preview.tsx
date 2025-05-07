import { useState, useEffect, useCallback } from 'react'
import { useFormikContext, FormikValues } from 'formik'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import CopyToClipboardButton from 'components/Common/CopyToClipboardButton'
import Download from '../Helpers/Download'
import { RigidBody, Chain } from 'types/interfaces'
import HeaderBox from 'components/HeaderBox'

const Preview = () => {
  useTitle('BilboMD: Preview const.inp file')
  const [constFilePreview, setConstFilePreview] = useState('')
  const [constFileBlob, setConstFileBlob] = useState<Blob | null>(null)
  const { values } = useFormikContext<FormikValues>()
  const rigid_bodies = values.pdb_file.rigid_bodies as RigidBody[]
  const chains = values.pdb_file.chains

  const pushWrappedLine = useCallback(
    (contentArray: string[], line: string) => {
      const maxLength = 77
      let currentLine = ''
      let numCharacters = 0

      for (let i = 0; i < line.length; i++) {
        const char = line.charAt(i)
        if (numCharacters + 1 > maxLength) {
          contentArray.push(currentLine)
          currentLine = ''
          numCharacters = 0
        }
        currentLine += char
        numCharacters++

        if (numCharacters === maxLength && i !== line.length - 1) {
          currentLine += '-'
          numCharacters++
        }
      }

      contentArray.push(currentLine)
    },
    []
  )

  const prepareConstInputFile = useCallback(
    (rigidBodies: RigidBody[], chains: Chain[]) => {
      const contentArray: string[] = []
      let dockCount = 1
      let rigidCount = 1

      rigidBodies.forEach((rb) => {
        if (rb.id === 'PRIMARY') {
          const rigid_domains: string[] = []
          rb.domains.forEach(
            ({ chainid: originalChainid, start, end }, d_index) => {
              let chainid = originalChainid
              const rd_index = d_index + 1
              const chain = chains.find((c) => c.id === chainid)
              let chainType = chain ? chain.type : ''
              chainType = chainType.toUpperCase()

              if (chainid.toLowerCase() === chainid) {
                chainType = chainType.slice(0, -1) + 'L'
                chainid = chainid.toUpperCase()
              }

              const line =
                'define fixed' +
                rd_index +
                ' sele ( resid ' +
                start +
                ':' +
                end +
                ' .and. segid ' +
                chainType +
                chainid +
                ' ) end'

              pushWrappedLine(contentArray, line)
              rigid_domains.push('fixed' + rd_index, '.or.')
            }
          )

          rigid_domains.pop()
          rigid_domains.push('end')
          const consFixSeleString = 'cons fix sele ' + rigid_domains.join(' ')
          pushWrappedLine(contentArray, consFixSeleString)
          contentArray.push(' ')
        } else {
          const rigid_domains: string[] = []
          rb.domains.forEach(({ chainid: originalChainid, start, end }) => {
            let chainid = originalChainid
            const chain = chains.find((c) => c.id === chainid)
            let chainType = chain ? chain.type : ''
            chainType = chainType.toUpperCase()

            if (chainid.toLowerCase() === chainid) {
              chainType = chainType.slice(0, -1) + 'L'
              chainid = chainid.toUpperCase()
            }

            const line =
              'define rigid' +
              rigidCount +
              ' sele ( resid ' +
              start +
              ':' +
              end +
              ' .and. segid ' +
              chainType +
              chainid +
              ' ) end'

            pushWrappedLine(contentArray, line)
            rigid_domains.push('rigid' + rigidCount, '.or.')
            rigidCount++
          })

          rigid_domains.pop()
          rigid_domains.push('end')
          const shapeDescLine =
            'shape desc dock' +
            dockCount +
            ' rigid sele ' +
            rigid_domains.join(' ')
          pushWrappedLine(contentArray, shapeDescLine)
          contentArray.push(' ')
          dockCount++
        }
      })

      contentArray.push('return')
      const content = contentArray.join('\n')
      setConstFilePreview(content)
      const file = new Blob([content], { type: 'text/plain' })
      setConstFileBlob(file)
    },
    [pushWrappedLine]
  )

  useEffect(() => {
    if (values) {
      prepareConstInputFile(rigid_bodies, chains)
    }
  }, [values, rigid_bodies, chains, prepareConstInputFile])

  return (
    <>
      <Grid container>
        <Grid>
          <HeaderBox>
            <Typography>Preview</Typography>
          </HeaderBox>
          <Paper sx={{ p: 1 }}>
            <Typography sx={{ m: 2 }}>
              This is the <code>const.inp</code> definition file with your Rigid
              Bodies and defined in a format that CHARMM will understand. You
              can either copy and paste the file shown below or, if you prefer,
              you can use the Download button.
            </Typography>
            <Typography sx={{ m: 2 }}>
              The <code>segid</code> values have been modified to ensure
              compatability with CHARMM.
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2,
                  m: 1,
                  backgroundColor: '#bae0ff',
                  color: 'black',
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
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export { Preview }
