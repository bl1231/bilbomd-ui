import { useEffect, useState } from 'react'
import { useDeleteJobMutation } from './jobsApiSlice'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Button, Tooltip, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LinearProgress from '@mui/material/LinearProgress'

interface DeleteJobProps {
  id: string
  title: string
  hide: boolean
}

const DeleteJob = ({ id, title, hide }: DeleteJobProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteJob, { isSuccess, isError, error }] = useDeleteJobMutation()
  // console.log('title:', title, 'hide:', hide)
  const onClickDelete = async () => {
    setDeleting(true) // Start deletion process
    // const start = Date.now()
    // console.log('onClickDelete start', start)
    await deleteJob({ id })
    // const end = Date.now()
    // console.log('onClickDelete end', end)
    // const duration = end - start
    // console.log(`Deletion took ${duration} milliseconds.`)
    setDeleting(false) // End deletion process
  }

  const handleCloseDialog = () => {
    setConfirmOpen(false)
    if (deleting) {
      // If the dialog is closed while deleting, stop hideing the progress
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('DeleteJob isSuccess:', isSuccess, 'error:', error)
    }
    if (isError) {
      console.log('DeleteJob isError:', isError, 'error:', error)
    }
  }, [isSuccess, isError, error])

  return (
    <>
      <Tooltip
        title={
          deleting || hide
            ? 'Cannot delete a Running or Submitted job'
            : `Delete ${title}`
        }
        arrow
      >
        <span>
          <IconButton
            onClick={() => setConfirmOpen(true)}
            disabled={deleting || hide}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog
        open={confirmOpen}
        onClose={handleCloseDialog}
      >
        <DialogContent>
          {deleting && <LinearProgress />}
          <DialogContentText>
            {deleting ? (
              <>
                <p>Deleting...</p>
                <p>Please be patient. This sometimes takes a few seconds.</p>
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
