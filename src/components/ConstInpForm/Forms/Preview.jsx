import React, { useState, useEffect, useRef } from 'react'
import { useFormikContext } from 'formik'
import { Button, Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import useTitle from 'hooks/useTitle'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
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
  const [constFilePreview, setConstFilePreview] = useState('init const.inp file')
  const { values } = useFormikContext()

  const prepareConstInpFile = () => {
    const contentArray = []
    const rigid_bodies = values.crd_file.rigid_bodies
    let rigidDomainTotal = 0
    for (const idx in rigid_bodies) {
      let rigidBodyId = rigid_bodies[idx].id

      if (rigidBodyId === 'PRIMARY') {
        let domainTotal = 0
        for (const domain in rigid_bodies[idx].domains) {
          domainTotal++
          let domainName = 'fixed' + domainTotal
          let chainId = rigid_bodies[idx].domains[domain].chainid
          let start = rigid_bodies[idx].domains[domain].start
          let end = rigid_bodies[idx].domains[domain].end

          const line =
            'define ' +
            domainName +
            ' sele ( resid ' +
            start +
            ':' +
            end +
            ' .and. segid ' +
            chainId +
            ' ) end'

          contentArray.push(line)
        }
        // There has to be a better way to construct this last line
        let ll = 'cons fix sele '
        for (let d = 1; d <= domainTotal; d++) {
          ll += 'fixed' + d + ' .or. '
        }
        // Trim off the last " .or " and add the "end" keyword.
        const lastLine = ll.slice(0, ll.length - 6) + ' end'
        contentArray.push(lastLine)
        contentArray.push('')
      } else {
        let totalDomains = 0
        for (const domain in rigid_bodies[idx].domains) {
          rigidDomainTotal++
          totalDomains++
          let domainName = 'rigid' + rigidDomainTotal
          let chainId = rigid_bodies[idx].domains[domain].chainid
          let start = rigid_bodies[idx].domains[domain].start
          let end = rigid_bodies[idx].domains[domain].end

          const line =
            'define ' +
            domainName +
            ' sele ( resid ' +
            start +
            ':' +
            end +
            ' .and. segid ' +
            chainId +
            ' ) end'

          contentArray.push(line)
        }
        // There has to be a better way to construct this last line

        let ll = 'shape desc dock' + idx + ' rigid sele '
        for (let d = 1; d <= totalDomains; d++) {
          ll += 'rigid' + d + ' .or. '
        }
        // Trim off the last " .or " and add the "end" keyword.
        const lastLine = ll.slice(0, ll.length - 6) + ' end'
        contentArray.push(lastLine)
        contentArray.push('')
      }
    }

    // and the last line needs to be "return"
    const returnLine = 'return'
    contentArray.push(returnLine)
    const content = contentArray.join('\n')
    console.log(content)
    setConstFilePreview(content)
    // Can't seem to store a Blob is useState so return a Blob for file download
    const file = new Blob([content], { type: 'text/plain' })
    return file
  }

  const handleDownload = () => {
    // 1. Get the Blob object (aka our file)
    const file = prepareConstInpFile()
    // 2. Create HTML <a> element
    const link = document.createElement('a')
    // 3. In the href attribute of the <a> tag, add the Blob object URL.
    link.href = window.URL.createObjectURL(file)
    // 4. Set attributes of the <a> element
    link.setAttribute('download', 'const.inp')
    // 5. Append the link to html page
    document.body.appendChild(link)
    // 6. Force download
    link.click()
    // 7. Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      if (values) {
        prepareConstInpFile()
      }
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Typography sx={HeaderThingee}>Preview</Typography>
          <Item>
            <Grid
              sx={{ m: 1, backgroundColor: '#87e8de', display: 'flex', flex: '1 1 100%' }}
            >
              <Grid
                item
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  px: 1,
                  mx: 1,
                  backgroundColor: '#ffe58f', //gold3
                  borderRadius: 1,
                  alignItems: 'center',
                  flex: '0 1 100%',
                  justifyContent: 'space-between'
                }}
              >
                <pre sx={{ fontFamily: 'Sans' }}>
                  <code>{constFilePreview}</code>
                </pre>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const PrepareConstInputFile = (rigid_bodies) => {
  const contentArray = []
  // const rigid_bodies = values.crd_file.rigid_bodies
  let rigidDomainTotal = 0
  for (const idx in rigid_bodies) {
    let rigidBodyId = rigid_bodies[idx].id

    if (rigidBodyId === 'PRIMARY') {
      let domainTotal = 0
      for (const domain in rigid_bodies[idx].domains) {
        domainTotal++
        let domainName = 'fixed' + domainTotal
        let chainId = rigid_bodies[idx].domains[domain].chainid
        let start = rigid_bodies[idx].domains[domain].start
        let end = rigid_bodies[idx].domains[domain].end

        const line =
          'define ' +
          domainName +
          ' sele ( resid ' +
          start +
          ':' +
          end +
          ' .and. segid ' +
          chainId +
          ' ) end'

        contentArray.push(line)
      }
      // There has to be a better way to construct this last line
      let ll = 'cons fix sele '
      for (let d = 1; d <= domainTotal; d++) {
        ll += 'fixed' + d + ' .or. '
      }
      // Trim off the last " .or " and add the "end" keyword.
      const lastLine = ll.slice(0, ll.length - 6) + ' end'
      contentArray.push(lastLine)
      contentArray.push('')
    } else {
      let totalDomains = 0
      for (const domain in rigid_bodies[idx].domains) {
        rigidDomainTotal++
        totalDomains++
        let domainName = 'rigid' + rigidDomainTotal
        let chainId = rigid_bodies[idx].domains[domain].chainid
        let start = rigid_bodies[idx].domains[domain].start
        let end = rigid_bodies[idx].domains[domain].end

        const line =
          'define ' +
          domainName +
          ' sele ( resid ' +
          start +
          ':' +
          end +
          ' .and. segid ' +
          chainId +
          ' ) end'

        contentArray.push(line)
      }
      // There has to be a better way to construct this last line

      let ll = 'shape desc dock' + idx + ' rigid sele '
      for (let d = 1; d <= totalDomains; d++) {
        ll += 'rigid' + d + ' .or. '
      }
      // Trim off the last " .or " and add the "end" keyword.
      const lastLine = ll.slice(0, ll.length - 6) + ' end'
      contentArray.push(lastLine)
      contentArray.push('')
    }
  }

  // and the last line needs to be "return"
  const returnLine = 'return'
  contentArray.push(returnLine)
  const content = contentArray.join('\n')
  console.log(content)
  // setConstFilePreview(content)
  // Can't seem to store a Blob is useState so return a Blob for file download
  const file = new Blob([content], { type: 'text/plain' })
  return file
}
export { Preview, PrepareConstInputFile }
