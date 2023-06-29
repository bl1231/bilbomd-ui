import { useState } from 'react'
import { useDeleteJobMutation } from './jobsApiSlice'
import { Job } from 'types/interfaces'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Button, IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface DeleteJobProps {
  job: Job
}

const DeleteJob = ({ job }: DeleteJobProps) => {
  const { title, id } = job
  const [open, setOpen] = useState(false)
  const [isDeleted, setDeleted] = useState(false)
  // const [deleteJob, { isSuccess, isError, error }] = useDeleteJobMutation()
  const [deleteJob] = useDeleteJobMutation()

  const onClickDelete = async () => {
    setOpen(false)
    //console.log(JSON.stringify(params.row, null, 4))
    await deleteJob({ id })
    setDeleted(true) // Set success state to true after deletion
    setTimeout(() => {
      setDeleted(false) // Reset success state after a delay
    }, 3000) // Change the delay as per your requirement
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {isDeleted && <p>Job deleted successfully!</p>}
      <Tooltip title={`Delete ${title}`} arrow>
        <IconButton color="secondary" onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>{`Delete ${title} ?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClickDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteJob
