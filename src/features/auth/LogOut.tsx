import { useState } from 'react'
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
  const [sendLogout] = useSendLogoutMutation()

  const onClickLogout = async () => {
    setOpen(false)
    await sendLogout({})
    navigate('.')
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Typography onClick={handleClickOpen}>Logout</Typography>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText sx={{ color: 'black' }}>
            Do you want to Logout?
          </DialogContentText>
          <DialogContentText>
            You will need to obtain a new MagickLink&#8482; to log back in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            // sx={{ backgroundColor: '#ff7875', color: 'black' }}
            onClick={handleClose}
          >
            Actually... Nevermind
          </Button>
          <Button variant="outlined" onClick={onClickLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LogOut
