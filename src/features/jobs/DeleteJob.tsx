import { useEffect, useState } from 'react'
import { useDeleteJobMutation } from './jobsApiSlice'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Button, Tooltip, Snackbar, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import LinearProgress from '@mui/material/LinearProgress'

interface DeleteJobProps {
  id: string
  title: string
}

const DeleteJob = ({ id, title }: DeleteJobProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [deleteJob, { isSuccess, isError, error }] = useDeleteJobMutation()

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const onClickDelete = async () => {
    setDeleting(true) // Start deletion process
    const start = Date.now()
    console.log('onClickDelete start', start)
    await deleteJob({ id })
    const end = Date.now()
    console.log('onClickDelete end', end)
    const duration = end - start
    console.log(`Deletion took ${duration} milliseconds.`)
    setDeleting(false) // End deletion process
  }

  const handleCloseDialog = () => {
    setConfirmOpen(false)
    if (deleting) {
      // If the dialog is closed while deleting, stop showing the progress
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('DeleteJob isSuccess:', isSuccess, 'error:', error)
      setSnackbarMessage('Job deleted successfully!')
      setSnackbarOpen(true)
      setConfirmOpen(false)
    }
    if (isError) {
      console.log('DeleteJob isError:', isError, 'error:', error)
      setSnackbarMessage(`Error deleting job: ${error || 'An unknown error occurred'}`)
      setSnackbarOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error])

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  return (
    <>
      <Tooltip title={`Delete ${title}`} arrow>
        <IconButton onClick={() => setConfirmOpen(true)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={confirmOpen} onClose={handleCloseDialog}>
        <DialogContent>
          {deleting && <LinearProgress />}
          <DialogContentText>{`Are you sure you want to delete ${title}?`}</DialogContentText>
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
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
    </>
  )
}

export default DeleteJob
