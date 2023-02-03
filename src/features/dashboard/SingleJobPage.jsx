import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleJobPage = () => {
  const { uuid } = useParams();
  console.log('SingleJobPage uuid', uuid);
  const [job, setJob] = useState([]);

  useEffect(() => {
    console.log('in useEffect uuid:', uuid);
    fetch(`http://localhost:3333/jobs/${uuid}`)
      .then((res) => res.json())
      .then((data) => setJob(data));
  }, [uuid]);

  // need some logic to handle cases when uuid does not exist

  return (
    <React.Fragment>
      <h2>{job.title}</h2>
    </React.Fragment>
  );
};

export default SingleJobPage;
