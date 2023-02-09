import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from 'features/auth/authSlice'
import { useLoginMutation } from 'features/auth/authApiSlice'
import { Alert, AlertTitle, CircularProgress, Grid } from '@mui/material'
import usePersist from 'hooks/usePersist'
import useTitle from 'hooks/useTitle'

const MagickLinkAuth = () => {
  useTitle('BilboMD: Check OTP')
  let { otp } = useParams()
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [persist, setPersist] = usePersist()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

  const [login, { isLoading }] = useLoginMutation()

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const authenticateOTP = async () => {
        try {
          const { accessToken } = await login({ otp }).unwrap()
          //console.log('MagickLinkAuth accessToken:', accessToken)
          dispatch(setCredentials({ accessToken }))
          setSuccess('y')
          // because we don't have a user interface for logging in we manually set persist
          setPersist(true)
          // wait here for a few seconds so user can see the Alert message
          await sleep(3000)
          navigate('/dashboard/jobs')
        } catch (err) {
          if (!err.status) {
            setError('No Server Response')
          } else if (err.status === 400) {
            setError('Missing OTP')
          } else if (err.status === 401) {
            setError('Unauthorized')
          } else {
            setError(err.data?.message)
          }
        }
      }
      authenticateOTP()
    }

    return () => (effectRan.current = true)

    // eslint-disable-next-line
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
          xs={6}
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderRadius: 1,
            borderColor: 'secondary.main'
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : success ? (
            <Alert severity="success">
              <AlertTitle>Woot!</AlertTitle>Your OTP has been successfully validated. You
              will be forwarded to your dashboard in a few seconds.
            </Alert>
          ) : (
            <Alert severity="warning">
              <AlertTitle>Warning!</AlertTitle>Hmmmmm. Maybe your MagickLink&#8482; has
              expired? Please try{' '}
              <a href="http://localhost:3001/magicklink">generating another</a>. If that
              doesn't work please contact us.
              <p>{error}</p>
            </Alert>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  )

  return content
}

export default MagickLinkAuth
