import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useLogout from 'hooks/useLogout';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/system';
import { Button, ButtonGroup, Typography } from '@mui/material';
//import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import JobCard from './JobCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const Dashboard = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate('/linkpage');
  };
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3333/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <Container>
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        color="textSecondary"
        sx={{ marginBottom: '20px' }}
      >
        DASHBOARD
      </Typography>
      <Grid container>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} lg={4} key={job.uuid}>
            <JobCard />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
