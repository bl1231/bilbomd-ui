import React from 'react'
import { DeleteOutlined } from '@mui/icons-material'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography
} from '@mui/material'
import { styled } from '@mui/system'
import { yellow, green, pink, blue, red } from '@mui/material/colors'

const JobCard = ({ job, handelDelete }) => {
  return (
    <Card elevation={1} sx={{ color: '#000' }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              ...(job.status === 'submitted' && {
                backgroundColor: green[200]
              }),
              ...(job.status === 'running' && {
                backgroundColor: green[300]
              }),
              ...(job.status === 'error' && {
                backgroundColor: red[900]
              }),
              ...(job.status === 'completed' && {
                backgroundColor: green[500]
              })
            }}
          >
            {job.message[0].toUpperCase()}
          </Avatar>
        }
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
  )
}

export default JobCard
