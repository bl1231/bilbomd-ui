import { useEffect, useState } from 'react'
import { useDeleteJobMutation } from 'slices/jobsApiSlice'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LinearProgress from '@mui/material/LinearProgress'

interface DeleteJobProps {
  id: string
  title: string
  hide: boolean
  onClose?: () => void
}

const DeleteJob = ({ id, title, hide, onClose }: DeleteJobProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteJob, { isSuccess, isError, error }] = useDeleteJobMutation()
  const onClickDelete = async () => {
    setDeleting(true)
    await deleteJob({ id })
    setDeleting(false)
  }

  const handleCloseDialog = () => {
    setConfirmOpen(false)
    if (deleting) {
      setDeleting(false)
    }
    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('DeleteJob isSuccess:', isSuccess, 'error:', error)
      if (onClose) onClose()
    }
    if (isError) {
      console.log('DeleteJob isError:', isError, 'error:', error)
    }
  }, [isSuccess, isError, error, onClose])

  return (
    <>
      <span>
        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={deleting || hide}
          startIcon={<DeleteIcon />}
          variant='outlined'
          className='job-details-button'
        >
          Trash
        </Button>
      </span>

      <Dialog open={confirmOpen} onClose={handleCloseDialog}>
        <DialogContent>
          {deleting && <LinearProgress />}
          <DialogContentText>
            {deleting ? (
              <>
                Deleting...
                <br />
                Please be patient. This sometimes takes a few seconds.
              </>
            ) : (
              `Are you sure you want to delete ${title}?`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={onClickDelete} autoFocus disabled={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteJob
