import React from 'react'
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
  useTitle('BilboMD: Download const.inp file')
  const { values } = useFormikContext()

  const prepareConstInpFile = () => {
    console.log('prep const.inp file')
    const content = []
    const file = new Blob([content], { type: 'text/plain' })
    return file
  }

  const handleDownload = () => {
    console.log('download de file')
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

  return (
    <React.Fragment>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>Preview</Typography>
          <Item>
            <Typography xs={12}>preview here</Typography>
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
