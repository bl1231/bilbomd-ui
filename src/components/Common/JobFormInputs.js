import { Field, useField } from 'formik';
import React, { useState, useEffect } from 'react';
import { Grid, FormHelperText } from '@mui/material';
import UploadField from './UploadField';

const JobFormInputs = (props) => {
  console.log('props is:', props);
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const {
    formField: { datafile }
  } = props;
  console.log('datafile:', datafile);
  const [field, meta, helper] = useField(datafile.name);
  //console.log('meta', meta);
  console.log('field', field);
  //console.log('helper', helper);
  const { touched, error } = meta;
  const { setValue } = helper;
  const isError = touched && error && true;
  const { value } = field;
  console.log(value);
  const [fileName, setFileName] = useState(value.name);
  const [file, setFile] = useState(value.file);
  const [src, setSrc] = useState(value.src);
  const _onChange = (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => setFileName(file.name);
      if (file.name !== fileName) {
        reader.readAsDataURL(file);
        setSrc(reader);
        setFile(file);
      }
    }
  };

  useEffect(() => {
    if (file && fileName && src) {
      setValue({ file: file, src: src, name: fileName });
      console.log(fileName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fileName, file]);

  return (
    <React.Fragment>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12}>
          <label style={{ color: `${isError ? 'red' : 'var(--main-color)'}` }}>
            {datafile.label}
          </label>
          <br />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              fontSize: '1.2em'
            }}
          >
            <Field
              variant="outlined"
              field={field}
              component={UploadField}
              onChange={_onChange}
              isError={isError}
            />
            {isError && <FormHelperText color={'red'}>{error}</FormHelperText>}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default JobFormInputs;
