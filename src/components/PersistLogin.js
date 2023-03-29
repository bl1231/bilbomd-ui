import { Outlet } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import useRefreshToken from 'hooks/useRefreshToken'
import useAuth from 'hooks/useAuth'
import { CircularProgress } from '@mui/material'

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuth()
  const effectRan = useRef(false)

  useEffect(() => {
    console.log('PersistLogin effect ran')
    //let isMounted = true;

    if (effectRan.current === false) {
      const verifyRefreshToken = async () => {
        try {
          await refresh()
        } catch (err) {
          console.error(err)
        } finally {
          //isMounted && setIsLoading(false);
          setIsLoading(false)
        }
      }

      // persist added here AFTER tutorial video
      // Avoids unwanted call to verifyRefreshToken
      !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

      return () => {
        console.log('PersistLogin effect unmounted')
        //isMounted = false;
        effectRan.current = true
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`)
    console.log(`accessToken: ${JSON.stringify(auth?.accessToken)}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return <>{!persist ? <Outlet /> : isLoading ? <CircularProgress /> : <Outlet />}</>
}

export default PersistLogin
