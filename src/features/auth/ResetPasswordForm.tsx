import { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import * as PropTypes from 'prop-types';

const ResetPasswordForm = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onSubmit(password);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Reset Password</Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Reset Password
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
