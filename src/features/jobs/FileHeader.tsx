import { Button, Grid, Typography } from '@mui/material'
import React from 'react'

export interface FileHeaderProps {
  file: File
  onDelete: (file: File) => void
}

export function FileHeader({ file, onDelete }: FileHeaderProps) {
  return (
    <Grid
      container
      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Grid item>
        <Typography>{file.name}</Typography>
      </Grid>
      <Grid item>
        <Button
          size="small"
          onClick={() => onDelete(file)}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  )
}
