import React from 'react'
import { Typography, Box } from '@mui/material'

const Introduction = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography variant='h1' sx={{ my: 3 }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ m: 2, p: 0 }}>
      <Typography variant='body1' sx={{ my: 1 }}>
        {children}
      </Typography>
    </Box>
  </Box>
)

export default Introduction
