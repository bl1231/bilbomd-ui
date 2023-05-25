import { Alert, AlertTitle, Grid } from '@mui/material'
import axios from 'app/api/axios'
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import useTitle from 'hooks/useTitle'
const VERIFY_URL = '/verify'

const VerifyEmail = () => {
  useTitle('BilboMD: Verify Email')
  let { code } = useParams()
  const data = JSON.stringify({ code })
  //console.log(data);

  const [verified, setVerified] = useState('')

  useEffect(() => {
    const verify = async () => {
      const response = await axios
        .post(VERIFY_URL, data, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .catch((err) => {
          if (err?.response) {
            console.error(err.response)
          }
        })
      console.log(response)
      if (response?.data.status === 204) {
        console.log(response.data.message)
      }
      if (response?.data) {
        setVerified(true)
        console.log(response)
      }
    }
    verify()
  }, [])

  const content = (
    <React.Fragment>
      <Grid
        container
        columns={12}
        direction="row"
        sx={{ height: '100vh' }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={4}
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderRadius: 1,
            borderColor: 'secondary.main'
          }}
        >
          {verified ? (
            <Alert severity="success">
              <AlertTitle>Woot! &#128640;</AlertTitle>
              Your email is verified. <br />
              Please login by obtaining a{' '}
              <Button
                sx={{ ml: 2 }}
                size="small"
                type="button"
                variant="contained"
                startIcon={<AutoFixHighIcon />}
                component={Link}
                to="../magicklink"
              >
                MagicLink &#8482;
              </Button>
            </Alert>
          ) : (
            <Alert severity="warning">
              <AlertTitle>Nope!</AlertTitle>
              Email Verification Failed.
              <br /> You may have used an outdated token. Please visit the{' '}
              <Link to="../login">login</Link> page and try again.
            </Alert>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  )

  return content
}

export default VerifyEmail
