import React, { useState, useEffect, useRef } from 'react'
import { useFormikContext } from 'formik'
import { Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'
import { Box } from '@mui/system'
import CopyToClipboardButton from 'components/Common/CopyToClipboardButton'
import Download from '../Helpers/Download'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary,
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

const Preview = (props) => {
  useTitle('BilboMD: Preview const.inp file')
  const [constFilePreview, setConstFilePreview] = useState('')
  const { values } = useFormikContext()
  const rigid_bodies = values.crd_file.rigid_bodies

  // const prepareConstInputFile = () => {
  //   const contentArray = []

  //   let rigidDomainTotal = 0
  //   for (const rbidx in rigid_bodies) {
  //     let rigidBodyId = rigid_bodies[rbidx].id

  //     if (rigidBodyId === 'PRIMARY') {
  //       let domainTotal = 0
  //       for (const didx in rigid_bodies[rbidx].domains) {
  //         domainTotal++
  //         let domainName = 'fixed' + domainTotal
  //         let chainId = rigid_bodies[rbidx].domains[didx].chainid
  //         let start = rigid_bodies[rbidx].domains[didx].start
  //         let end = rigid_bodies[rbidx].domains[didx].end

  //         const line =
  //           'define ' +
  //           domainName +
  //           ' sele ( resid ' +
  //           start +
  //           ':' +
  //           end +
  //           ' .and. segid ' +
  //           chainId +
  //           ' ) end'

  //         contentArray.push(line)
  //       }
  //       // There has to be a better way to construct this last line
  //       let ll = 'cons fix sele '
  //       for (let d = 1; d <= domainTotal; d++) {
  //         ll += 'fixed' + d + ' .or. '
  //       }
  //       // Trim off the last " .or " and add the "end" keyword.
  //       const lastLine = ll.slice(0, ll.length - 6) + ' end'
  //       contentArray.push(lastLine)
  //       contentArray.push('')
  //     } else {
  //       let totalDomains = 0
  //       for (const didx in rigid_bodies[rbidx].domains) {
  //         // LOOP WRITES THE define LINES
  //         rigidDomainTotal++
  //         totalDomains++
  //         let domainName = 'rigid' + rigidDomainTotal
  //         let chainId = rigid_bodies[rbidx].domains[didx].chainid
  //         let start = rigid_bodies[rbidx].domains[didx].start
  //         let end = rigid_bodies[rbidx].domains[didx].end

  //         const line =
  //           'define ' +
  //           domainName +
  //           ' sele ( resid ' +
  //           start +
  //           ':' +
  //           end +
  //           ' .and. segid ' +
  //           chainId +
  //           ' ) end'

  //         contentArray.push(line)
  //       }
  //       let numRigidDomains = rigid_bodies[rbidx].domains.length
  //       console.log(
  //         'numRigidDomains: ',
  //         numRigidDomains,
  //         'rigidDomainTotal: ',
  //         rigidDomainTotal
  //       )
  //       let ll = 'shape desc dock' + rbidx + ' rigid sele '
  //       for (let d = rigidDomainTotal; d <= numRigidDomains; d++) {
  //         ll += 'rigid' + d + ' .or. '
  //       }
  //       // Trim off the last " .or " and add the "end" keyword.
  //       const lastLine = ll.slice(0, ll.length - 6) + ' end'
  //       contentArray.push(lastLine)
  //       contentArray.push('')
  //     }
  //   }

  //   // and the last line needs to be "return"
  //   const returnLine = 'return'
  //   contentArray.push(returnLine)
  //   const content = contentArray.join('\n')
  //   // console.log(content)
  //   setConstFilePreview(content)
  //   // Can't seem to store a Blob in useState so return a Blob for file download
  //   const file = new Blob([content], { type: 'text/plain' })
  //   return file
  // }

  const prepareConstInputFile = (rigidBodies) => {
    const contentArray = []
    let dockCount = 1
    let rigidCount = 1
    const output = rigidBodies.map((rb, rb_index) => {
      if (rb.id === 'PRIMARY') {
        let rigid_domains = []
        const output2 = rb.domains.map(({ chainid, start, end }, d_index) => {
          let rd_index = d_index + 1

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
        let rigid_domains = []
        const output2 = rb.domains.map(({ chainid, start, end }, d_index) => {
          let rd_index = d_index + rigidCount

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
    //console.log(content)
    setConstFilePreview(content)
    // const file = new Blob([content], { type: 'text/plain' })
    // return file
  }

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      if (values) {
        prepareConstInputFile(rigid_bodies)
        //doAThing()
      }
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  return (
    <React.Fragment>
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
            <Download />
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const PrepareConstInputFile = (rigidBodies) => {
  const contentArray = []
  let dockCount = 1
  let rigidCount = 1
  const output = rigidBodies.map((rb, rb_index) => {
    if (rb.id === 'PRIMARY') {
      let rigid_domains = []
      const output2 = rb.domains.map(({ chainid, start, end }, d_index) => {
        let rd_index = d_index + 1

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
      let rigid_domains = []
      const output2 = rb.domains.map(({ chainid, start, end }, d_index) => {
        let rd_index = d_index + rigidCount

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
  // console.log(content)
  // setConstFilePreview(content)
  const file = new Blob([content], { type: 'text/plain' })
  return file
}

export { Preview, PrepareConstInputFile }
