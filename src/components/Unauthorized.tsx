import { Alert, AlertTitle } from '@mui/material'

const Unauthorized = () => {
  return (
    <>
      <Alert severity='warning'>
        <AlertTitle>Warning</AlertTitle>You do not have access to the requested
        page.
      </Alert>
    </>
  )
}

export default Unauthorized
