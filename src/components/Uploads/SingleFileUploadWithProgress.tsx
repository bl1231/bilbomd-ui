import { Grid, LinearProgress } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { FileHeader } from './FileHeader';
import axios from 'api/axios';
import { number } from 'yup/lib/locale';
const axios_upload_url = '/upload/pdb';

export interface SingleFileUploadWithProgressProps {
  file: File;
  onDelete: (file: File) => void;
  onUpload: (file: File, uuid: string) => void;
}

export function SingleFileUploadWithProgress({
  file,
  onDelete,
  onUpload
}: SingleFileUploadWithProgressProps) {
  const [progress, setProgress] = useState(0);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const upload = async () => {
        const uuid = await uploadFile(file, setProgress);
        console.log('uuid:', uuid);
        onUpload(file, uuid);
      };
      upload();
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  return (
    <Grid item>
      <FileHeader file={file} onDelete={onDelete} />
      <LinearProgress variant="determinate" value={progress} />
    </Grid>
  );
}

function uploadFile(file: File, onProgress: (percentage: number) => void) {
  return new Promise<string>((res, rej) => {
    const formData = new FormData();
    formData.append('file', file);

    // const config = {
    //   onUploadProgress: function(progressEvent) {
    //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //     console.log(percentCompleted)
    //   }
    // }

    axios
      .post(axios_upload_url, formData, {
        onUploadProgress: function (axiosProgressEvent) {
          const percentage = Math.round(
            (axiosProgressEvent?.loaded /
              (axiosProgressEvent?.total ? axiosProgressEvent.total : 1)) *
              100
          );
          console.log(percentage);
        }
      })
      .then(function (response) {
        //console.log(response.data);
        //console.log(response.status);
        //console.log(response.statusText);
        //console.log(response.headers);
        //console.log(response.config);

        res(response.data.uuid);
      })
      .catch((err) => {
        console.log(err);
      });

    //   const xhr = new XMLHttpRequest();
    //   xhr.open('POST', url);
    //   xhr.onload = () => {
    //     const resp = JSON.parse(xhr.responseText);
    //     res(resp.secure_url);
    //   };
    //   xhr.onerror = (evt) => rej(evt);
    //   xhr.upload.onprogress = (event) => {
    //     if (event.lengthComputable) {
    //       const percentage = (event.loaded / event.total) * 100;
    //       onProgress(Math.round(percentage));
    //     }
    //   };
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   formData.append('upload_preset', key);
    //   xhr.send(formData);
  });
}
