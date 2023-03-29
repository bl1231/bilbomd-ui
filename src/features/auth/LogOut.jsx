import React, { useState } from 'react'
import { useSendLogoutMutation } from 'features/auth/authApiSlice'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router'

const LogOut = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

  const onClickLogout = async () => {
    setOpen(false)
    await sendLogout()
    navigate('.')
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Typography onClick={handleClickOpen}>Logout</Typography>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>Logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No Thanks</Button>
          <Button onClick={onClickLogout} autoFocus>
            Yes Please
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default LogOut
