import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { setCredentials } from 'slices/authSlice'
import { useLoginMutation } from 'slices/authApiSlice'
import { Alert, AlertTitle, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid'
import usePersist from 'hooks/usePersist'
import useTitle from 'hooks/useTitle'
import { isAxiosError } from 'app/api/axios'

const MagickLinkAuth = () => {
  useTitle('BilboMD: Check OTP')

  const { otp } = useParams()
  const [success, setSuccess] = useState(false)
  const [authErrorMsg, setAuthErrorMsg] = useState('')
  const [persist, setPersist] = usePersist()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const authenticateOTP = async () => {
      try {
        const { accessToken } = await login({ otp }).unwrap()
        dispatch(setCredentials({ accessToken }))
        setSuccess(true)
        if (!persist) {
          setPersist(true)
        }
        timeoutId = setTimeout(() => {
          navigate('../dashboard/jobs')
        }, 3000)
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          setAuthErrorMsg(err.response.data.message || 'No Server Response1')
        } else {
          setAuthErrorMsg('No Server Response2')
        }
      }
    }

    authenticateOTP()
    return () => clearTimeout(timeoutId)
  }, [login, otp, persist, setPersist, navigate, dispatch])

  const content = (
    <Grid
      container
      columns={12}
      direction='row'
      sx={{ height: '100vh' }}
      alignItems='center'
      justifyContent='center'
    >
      <Grid
        size={{ xs: 6 }}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          border: 1,
          borderRadius: 1
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : success ? (
          <Alert severity='success'>
            <AlertTitle>Woot!</AlertTitle>Your OTP has been successfully
            validated. You will be forwarded to your dashboard in a few seconds.
          </Alert>
        ) : (
          <Alert severity='warning'>
            <AlertTitle>Warning!</AlertTitle>Hmmmmm. Maybe your
            MagickLink&#8482; has expired? Please try{' '}
            <Link to='../../magicklink'>generating another</Link>. If that
            doesn&apos;t work please contact us.
            <br />
            <p>{authErrorMsg}</p>
          </Alert>
        )}
      </Grid>
    </Grid>
  )

  return content
}

export default MagickLinkAuth
