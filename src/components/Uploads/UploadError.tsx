import React from 'react';
import { FileError } from 'react-dropzone';
import { FileHeader } from './FileHeader';
//import { styled } from '@mui/material/styles';
import styled from '@emotion/styled';
import { LinearProgress, Typography } from '@mui/material';
export interface UploadErrorProps {
  file: File;
  onDelete: (file: File) => void;
  errors: FileError[];
}

// const ErrorLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   //backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
//   backgroundColor: 'red'
// }));

const ErrorLinearProgress = styled(LinearProgress)`
  height: 100;
  background-color: red;
  color: red;
  border-radius: 5;
`;

export function UploadError({ file, onDelete, errors }: UploadErrorProps) {
  return (
    <React.Fragment>
      <FileHeader file={file} onDelete={onDelete} />
      <ErrorLinearProgress variant="determinate" value={0} />
      {errors.map((error) => (
        <div key={error.code}>
          <Typography color="error">{error.message}</Typography>
        </div>
      ))}
    </React.Fragment>
  );
}
