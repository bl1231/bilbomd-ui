import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import { Alert, Button, CircularProgress, Grid } from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const isMountedRef = useRef(false) // Create a ref to track the initial mount

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      // console.log('verifying refresh token')
      try {
        //const response =
        await refresh()
        //const { accessToken } = response.data
        // needed to differentiate the isSuccess from refresh
        setTrueSuccess(true)
      } catch (error) {
        console.error(error)
      }
    }
    if (!isMountedRef.current) {
      // Only execute verifyRefreshToken on initial mount
      isMountedRef.current = true
      // and only if there is not existing token AND persist is true
      if (!token && persist) verifyRefreshToken()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let content

  if (!persist) {
    // persist: no
    // console.log('no persist')
    content = <Outlet />
  } else if (isLoading) {
    //persist: yes, token: no
    // console.log('loading')
    content = <CircularProgress />
  } else if (isError) {
    //persist: yes, token: no
    // console.log('error')
    content = (
      <Grid
        container
        columns={12}
        direction="row"
        sx={{ height: '100vh' }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sx={{ width: '300px' }}>
          <Alert
            variant="filled"
            severity="error"
            // sx={{ backgroundColor: '#ffa39e', color: 'black' }}
          >
            {error ? 'Session has expired' : ''}
          </Alert>
          <Button
            fullWidth
            sx={{ my: 2 }}
            variant="contained"
            type="button"
            color="primary"
            startIcon={<AutoFixHighIcon />}
            component={Link}
            to="magicklink"
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
    // console.log('token and uninit')
    // console.log('isUninitialized:', isUninitialized)
    content = <Outlet />
  }

  return content
}

export default PersistLogin