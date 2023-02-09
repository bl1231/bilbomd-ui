import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import { Alert, AlertTitle, Button, CircularProgress, Grid } from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)

  //
  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        console.log('verifying refresh token')
        try {
          //const response =
          await refresh()
          //const { accessToken } = response.data
          // needed to differentiate the isSuccess from refresh
          setTrueSuccess(true)
        } catch (err) {
          console.error(err)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    return () => (effectRan.current = true)

    // eslint-disable-next-line
  }, [])

  let content
  if (!persist) {
    // persist: no
    console.log('no persist')
    content = <Outlet />
  } else if (isLoading) {
    //persist: yes, token: no
    console.log('loading')
    content = <CircularProgress />
  } else if (isError) {
    //persist: yes, token: no
    console.log('error')
    content = (
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
          md={4}
        >
          <Alert
            variant="filled"
            severity="error"
          >
            <AlertTitle>{error?.data?.message}</AlertTitle>
            Please login again
          </Alert>
          <Button
            fullWidth
            sx={{ my: 2 }}
            variant="contained"
            type="button"
            color="primary"
            startIcon={<AutoFixHighIcon />}
            component={Link}
            to="/magicklink"
          >
            Request a new MagickLink&#8482;
          </Button>
        </Grid>
      </Grid>
    )
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log('success')
    content = <Outlet />
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log('token and uninit')
    console.log('isUninitialized:', isUninitialized)
    content = <Outlet />
  }

  return content
}
export default PersistLogin
