import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'api/axios';
const axios_upload_url = '/upload';

const NewUpload = () => {
  //const [pdb, setPDB] = useState();

  const formik = useFormik({
    initialValues: { title: '', pdb: '' },
    onSubmit: (values) => {
      console.log(values);
      const form = new FormData();
      form.append('title', values.title);
      form.append('pdb', document.getElementById('pdb').files[0]);
      form.append('expdata', document.getElementById('expdata').files[0]);
      const upload = async () => {
        const result = await axios
          .post(axios_upload_url, form)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        console.log(result);
      };
      upload();
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input id="title" name="title" type="text" {...formik.getFieldProps('title')} />
      <label htmlFor="title">PDB:</label>

      <input id="pdb" name="pdb" type="file" {...formik.getFieldProps('pdb')} />
      <label htmlFor="expdata">data:</label>
      <input id="expdata" name="expdata" type="file" {...formik.getFieldProps('expdata')} />

      <button type="submit">Submit</button>
    </form>
  );
};

export default NewUpload;
