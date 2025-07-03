import { Outlet, Link } from 'react-router'
import { useEffect, useState } from 'react'
import { useRefreshMutation } from 'slices/authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../../slices/authSlice'
import { Alert, Button, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh({}).unwrap()
        setTrueSuccess(true)
      } catch (err) {
        console.error('Refresh failed:', err)
      }
    }
    if (persist && !token) {
      verifyRefreshToken()
    }
  }, [persist, refresh, token])

  console.log('PersistLogin:', { token, persist })

  let content

  if (!persist) {
    // persist: no
    content = <Outlet />
  } else if (isLoading) {
    //persist: yes, token: no
    content = <CircularProgress />
  } else if (isError) {
    //persist: yes, token: no
    content = (
      <Grid
        container
        columns={12}
        direction='row'
        sx={{ height: '100vh' }}
        alignItems='center'
        justifyContent='center'
      >
        <Grid sx={{ width: '300px' }}>
          <Alert variant='outlined' severity='error' sx={{ mb: 2 }}>
            {error ? 'Session has expired' : ''}
          </Alert>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            startIcon={<AutoFixHighIcon />}
            component={Link}
            to='/auth/orcid-error?reason=session-expired'
            sx={{ mb: 1 }}
          >
            Continue with ORCID
          </Button>
          <Button
            fullWidth
            variant='outlined'
            color='secondary'
            component={Link}
            to='/magicklink'
          >
            Request A New MagickLink&#8482;
          </Button>
        </Grid>
      </Grid>
    )
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    // console.log('success')
    content = <Outlet />
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    // console.log('token and uninitialized')
    // console.log('isUninitialized:', isUninitialized)
    content = <Outlet />
  }

  return content
}

export default PersistLogin
