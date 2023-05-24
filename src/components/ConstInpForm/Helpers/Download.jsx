import React from 'react'
import { Button, Grid } from '@mui/material'
import { PrepareConstInputFile } from '../Forms/Preview'
import { useFormikContext } from 'formik'
import { Box } from '@mui/system'

const Download = (props) => {
  const { values } = useFormikContext()
  const rigidBodies = values.crd_file.rigid_bodies

  const handleDownload = () => {
    // 1. Get the Blob object (aka our file)
    const file = PrepareConstInputFile(rigidBodies)
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // backgroundColor: 'cyan',
        flex: '1 1 50%',
        mx: 1
      }}
    >
      <Grid
        item
        sx={{
          display: 'flex',
          alignSelf: 'end'
        }}
      >
        <Button variant="contained" type="button" onClick={handleDownload}>
          Download
        </Button>
      </Grid>
    </Box>
  )
  return content
}

export default Download
