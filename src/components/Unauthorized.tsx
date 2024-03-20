import { Alert, AlertTitle } from "@mui/material"
// import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
  // const navigate = useNavigate()

  // const goBack = () => navigate(-1)

  return (
    <>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>You do not have access to the requested
        page.
      </Alert>
    </>
  )
}

export default Unauthorized
