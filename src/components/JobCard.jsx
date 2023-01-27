import { DeleteOutlined } from '@mui/icons-material';
import { Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import React from 'react';

const JobCard = ({ job, handelDelete }) => {
  return (
    <Card elevation={1} sx={{ color: '#000' }}>
      <CardHeader
        action={
          <IconButton onClick={() => handelDelete(job.uuid)}>
            <DeleteOutlined />
          </IconButton>
        }
        title={job.title}
        subheader={job.status}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {job.message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobCard;
