import { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import * as PropTypes from 'prop-types';

const ForgotPasswordForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Forgot Password</Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Send Reset Link
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
