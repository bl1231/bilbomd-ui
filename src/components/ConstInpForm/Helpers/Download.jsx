import React from 'react'
import { Button, Grid } from '@mui/material'
import { PrepareConstInputFile } from '../Forms/Preview'
import { useFormikContext } from 'formik'

const Download = (props) => {
  const { values } = useFormikContext()

  const handleDownload = () => {
    // 1. Get the Blob object (aka our file)
    const file = PrepareConstInputFile(values.crd_file.rigid_bodies)
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
  let content = (
    <Grid item>
      <Button variant="contained" type="button" onClick={handleDownload}>
        Download
      </Button>
    </Grid>
  )
  return content
}

export default Download
