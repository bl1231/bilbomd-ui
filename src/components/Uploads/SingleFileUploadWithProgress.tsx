//import axios from 'api/axios';
import React, { useEffect, useState, useRef } from 'react';
import { LinearProgress, Grid } from '@mui/material';
import { FileHeader } from './FileHeader';
import axios from 'api/axios';
const UPLOAD_URL = '/upload';

export interface SingleFileUploadWithProgressProps {
  file: File;
  onDelete: (file: File) => void;
  onUpload: (file: File, url: string) => void;
}

export default function SingleFileUploadWithProgress({
  file,
  onDelete,
  onUpload
}: SingleFileUploadWithProgressProps) {
  const [progress, setProgress] = useState(0);
  const data = new FormData();
  const effectRan = useRef(false);

  useEffect(() => {
    console.log('SingleFileUploadWithProgress useEffect ran');
    if (effectRan.current === false) {
      const upload = async () => {
        console.log(file);
        data.append('file', file, 'mycoolfilename.pdb');
        console.log(data);
        const result = await axios
          .post(UPLOAD_URL, file, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
            onUploadProgress: function (progressEvent) {
              if (progressEvent?.loaded && progressEvent?.total) {
                let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log('progress:', progress);
              }
            }
          })
          .then((res) => console.log('RES:', res))
          .catch((err) => console.log('ERR', err));
        //onUpload(file, url);
        console.log('HERE:', file, result);
      };
      upload();
      return () => {
        console.log('SingleFileUploadWithProgress useEffect cleanup');
        effectRan.current = true;
      };
    }
  }, []);

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
  );
}
