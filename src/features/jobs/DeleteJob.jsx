import React, { useState } from 'react'
import { useDeleteJobMutation } from './jobsApiSlice'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Button, IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const DeleteJob = ({ job }) => {
  const { title, id } = job
  const [open, setOpen] = useState(false)

  const [deleteJob, { isSuccess, isError, error }] = useDeleteJobMutation()

  const onClickDelete = async () => {
    setOpen(false)
    //console.log(JSON.stringify(params.row, null, 4))
    await deleteJob({ id: id })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Tooltip title={`Delete ${title}`} arrow>
        <IconButton color="secondary" onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>{`Delete ${title}?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClickDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default DeleteJob
