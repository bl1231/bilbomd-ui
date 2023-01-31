//import { useNavigate } from 'react-router-dom';
//import useAuth from 'hooks/useAuth';
//import useLogout from 'hooks/useLogout';
//import { useEffect, useState } from 'react';
import { Container } from '@mui/system';
import Typography from 'themes/overrides/Typography';
import JobTable from './JobTable';
//import { Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container>
      <Typography> Your Jobs</Typography>
      <JobTable />
    </Container>
  );
};

export default Dashboard;
