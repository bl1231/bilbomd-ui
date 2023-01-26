import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useLogout from 'hooks/useLogout';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Container } from '@mui/system';
import { Button, ButtonGroup, Typography } from '@mui/material';
//import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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
      <Button
        variant="contained"
        color="secondary"
        endIcon={<KeyboardArrowRightIcon />}
      >
        Submit
      </Button>
      <br />
    </Container>
  );
};

export default Dashboard;
