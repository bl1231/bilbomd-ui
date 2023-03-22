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

const DownloadForm = (props) => {
  useTitle('BilboMD: Preview const.inp file')
  const [constFilePreview, setConstFilePreview] = useState('init const.inp file')
  const { values } = useFormikContext()

  const prepareConstInpFile = () => {
    const contentArray = []
    const chains = values.crd_file.chains
    let domainTotal = 0

    for (const chain in chains) {
      let chainId = chains[chain].id
      for (const domain in chains[chain].domains) {
        domainTotal++
        let start = chains[chain].domains[domain].start
        let end = chains[chain].domains[domain].end

        const line =
          'define fixed' +
          domainTotal +
          ' sele ( resid ' +
          start +
          ':' +
          end +
          ' .and. segid ' +
          chainId +
          ' ) end'
        contentArray.push(line)
      }
    }
    // There has to be a better way to construct this last line
    let ll = 'cons fix sele '
    for (let d = 1; d <= domainTotal; d++) {
      ll += 'fixed' + d + ' .or. '
    }
    // Trim off the last " .or " and add the "end" keyword.
    const lastLine = ll.slice(0, ll.length - 6) + ' end'
    contentArray.push(lastLine)
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
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Preview</Typography>
          <Item>
            <pre>{constFilePreview}</pre>
          </Item>
        </Grid>
        <Grid item>
          <Button variant="contained" type="button" onClick={handleDownload}>
            Download
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default DownloadForm
