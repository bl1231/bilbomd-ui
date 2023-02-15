import { Grid, LinearProgress } from '@mui/material'
//import { LinearProgress } from '@mui/joy';
import React, { useEffect, useState, useRef } from 'react'
import { FileHeader } from './FileHeader'
import axios from 'app/api/axios'
import { ErrorSharp } from '@mui/icons-material'
const axios_upload_url = '/upload/pdb'

export interface SingleFileUploadWithProgressProps {
  file: File
  onDelete: (file: File) => void
  onUpload: (file: File, uuid: string) => void
}

export function SingleFileUploadWithProgress({
  file,
  onDelete,
  onUpload
}: SingleFileUploadWithProgressProps) {
  const [progress, setProgress] = useState(0)

  // for preventing useEffect from running twice when component mounts
  const effectRan = useRef(false)

  // try removing this so PDBs are only uploaded with main form.
  // useEffect(() => {
  //   if (effectRan.current === false) {
  //     const upload = async () => {
  //       const uuid = await uploadFile(file, setProgress);
  //       //console.log('uuid:', uuid);
  //       onUpload(file, uuid);
  //     };
  //     upload();
  //     return () => {
  //       effectRan.current = true;
  //     };
  //   }
  // }, []);

  return (
    <Grid item>
      <FileHeader
        file={file}
        onDelete={onDelete}
      />
      <LinearProgress
        variant="determinate"
        value={progress}
      />
    </Grid>
  )
}
