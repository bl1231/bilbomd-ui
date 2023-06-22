import useAuth from 'hooks/useAuth'
import useTitle from 'hooks/useTitle'
import { Typography } from '@mui/material'

const Welcome = () => {
  const { username } = useAuth()

  useTitle(`BilboMD: ${username}`)

  const content = (
    <>
      <Typography variant="h2" sx={{ my: 3 }}>
        Welcome {username}!
      </Typography>
      <Typography>Let&apos;s run some BilboMD simulations.</Typography>
      <Typography>System is running in {process.env.NODE_ENV} mode</Typography>
      {/* <Typography>{import.meta.env.BASE_URL}</Typography> */}
      <Typography>
        {' '}
        and accessing bilbomd-backedn API via PORT:{' '}
        {import.meta.env.VITE_BILBOMD_BACKEND_PORT}
      </Typography>
      {/* <Typography>{import.meta.env.VITE_BILBOMD_BACKEND_PORT_NOPE}</Typography> */}
    </>
  )

  return content
}

export default Welcome
