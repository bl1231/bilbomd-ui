//import { useNavigate } from 'react-router-dom';
//import useAuth from 'hooks/useAuth';
//import useLogout from 'hooks/useLogout';
//import { useEffect, useState } from 'react';
import { Container } from '@mui/system';
import JobTable from './JobTable';
//import { Typography } from '@mui/material';

const Dashboard = () => {
  //const { setAuth } = useAuth();
  //const navigate = useNavigate();
  //const logout = useLogout();
  // const signOut = async () => {
  //   await logout();
  //   navigate('/linkpage');
  // };
  //const [jobs, setJobs] = useState([]);

  // useEffect(() => {
  //   fetch('http://localhost:3333/jobs')
  //     .then((res) => res.json())
  //     .then((data) => setJobs(data));
  // }, []);

  // const handleDelete = async (uuid) => {
  //   await fetch('http://localhost:3333/jobs' + uuid, {
  //     method: 'DELETE'
  //   });
  //   const newJobs = jobs.filter((job) => job.uuid !== uuid);
  //   setJobs(newJobs);
  // };

  return (
    <Container>
      <JobTable />
    </Container>
  );
};

export default Dashboard;
