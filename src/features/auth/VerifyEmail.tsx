import { Alert, AlertTitle, Grid } from '@mui/material'
import axiosInstance from 'app/api/axios'
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import useTitle from 'hooks/useTitle'

const VerifyEmail = () => {
  useTitle('BilboMD: Verify Email')
  const { code } = useParams()
  const data = JSON.stringify({ code })
  // console.log(data)

  const isMountedRef = useRef(false) // Create a ref to track the initial mount
  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'failure'
  >('loading')

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axiosInstance.post('/verify', data, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        console.log('res1:', response.data.message)
        if (response.data.message === 'Verified') {
          // console.log('seems we should be verified')
          setVerificationStatus('success')
        } else {
          // console.log('res2:', response.data.message)
          setVerificationStatus('failure')
        }
      } catch (error) {
        // console.error('auth error: ', error)
        setVerificationStatus('failure')
      }
    }

    if (!isMountedRef.current) {
      // Only execute the effect on initial mount
      isMountedRef.current = true
      verify()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
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
        {verificationStatus === 'loading' && (
          <Alert severity="info">
            <AlertTitle>Verifying...</AlertTitle>
          </Alert>
        )}

        {verificationStatus === 'success' && (
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
        )}

        {verificationStatus === 'failure' && (
          <Alert severity="warning">
            <AlertTitle>Nope!</AlertTitle>
            Email Verification Failed.
            <br /> You may have used an outdated token. Please visit the{' '}
            <Link to="../login">login</Link> page and try again.
          </Alert>
        )}
      </Grid>
    </Grid>
  )
}

export default VerifyEmail
