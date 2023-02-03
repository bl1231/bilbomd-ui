import React, { useCallback, useState, useEffect } from 'react';
import { FileRejection, useDropzone, FileError } from 'react-dropzone';
import { Grid } from '@mui/material';
import { useField } from 'formik';
import { SingleFileUploadWithProgress } from './SingleFileUploadWithProgress';
import { UploadError } from './UploadError';

const dropzone = {
  border: '1px dashed blue',
  borderRadius: '0.2em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'lightblue',
  height: '1em',
  outline: 'none',
  marginBottom: '1em',
  padding: '1em'
};

let currentId = 0;

function getNewId() {
  // we could use a fancier solution instead of a sequential ID :)
  return ++currentId;
}

export interface UploadableFile {
  // id was added after the video being released to fix a bug
  // Video with the bug -> https://youtube-2021-feb-multiple-file-upload-formik-bmvantunes.vercel.app/bug-report-SMC-Alpha-thank-you.mov
  // Thank you for the bug report SMC Alpha - https://www.youtube.com/channel/UC9C4AlREWdLoKbiLNiZ7XEA
  id: number;
  file: File;
  errors: FileError[];
  uuid?: string;
}

export function MultipleFileUploadField({ name }: { name: string }) {
  const [_, __, helpers] = useField(name);
  const [files, setFiles] = useState<UploadableFile[]>([]);

  const onDrop = useCallback((accFiles: File[], rejFiles: FileRejection[]) => {
    const mappedAcc = accFiles.map((file) => ({ file, errors: [], id: getNewId() }));
    const mappedRej = rejFiles.map((r) => ({ ...r, id: getNewId() }));
    setFiles((curr) => [...curr, ...mappedAcc, ...mappedRej]);
  }, []);

  useEffect(() => {
    helpers.setValue(files);
    // helpers.setTouched(true);
  }, [files]);

  function onUpload(file: File, uuid: string) {
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, uuid };
        }
        return fw;
      })
    );
  }

  function onDelete(file: File) {
    setFiles((curr) => curr.filter((fw) => fw.file !== file));
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.pdb', '.dat', '.inp'],
      'chemical/x-pdb': []
    },
    maxSize: 5000 * 1024
  });

  return (
    <React.Fragment>
      <Grid item>
        <div {...getRootProps()} style={dropzone}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop your PDB files here, or click to select files</p>
        </div>
      </Grid>

      {files.map((fileWrapper) => (
        <Grid item key={fileWrapper.id} sx={{ bgcolor: 'info-main' }}>
          {fileWrapper.errors.length ? (
            <UploadError file={fileWrapper.file} errors={fileWrapper.errors} onDelete={onDelete} />
          ) : (
            <SingleFileUploadWithProgress
              onDelete={onDelete}
              onUpload={onUpload}
              file={fileWrapper.file}
            />
          )}
        </Grid>
      ))}
    </React.Fragment>
  );
}
