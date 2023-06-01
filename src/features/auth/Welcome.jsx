import React from 'react'
import useAuth from 'hooks/useAuth'
import useTitle from 'hooks/useTitle'
import { Typography } from '@mui/material'

const Welcome = () => {
  const { username } = useAuth()

  useTitle(`BilboMD: ${username}`)

  const content = (
    <React.Fragment>
      <Typography variant="h2" sx={{ my: 3 }}>
        Welcome {username}!
      </Typography>
      <Typography>Let&apos;s run some BilboMD simulations.</Typography>
      <Typography>{process.env.NODE_ENV}</Typography>
      <Typography>{import.meta.env.BASE_URL}</Typography>
      <Typography>{import.meta.env.VITE_BILBOMD_BACKEND_PORT}</Typography>
      <Typography>{import.meta.env.VITE_BILBOMD_BACKEND_PORT_NOPE}</Typography>
    </React.Fragment>
  )

  return content
}

export default Welcome
