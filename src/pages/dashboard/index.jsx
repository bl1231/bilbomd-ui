import { Container } from '@mui/system';
import Typography from 'themes/overrides/Typography';
import JobTable from './JobTable';

const Dashboard = () => {
  return (
    <Container>
      <Typography> Your Jobs</Typography>
      <JobTable />
    </Container>
  );
};

export default Dashboard;
