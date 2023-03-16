import React from 'react'
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'

const ChainCard = ({ chain }) => {
  return (
    <div>
      <Card elevation={1} sx={{ background: '#fff1f0' }}>
        <CardHeader title={'Chain ID: ' + chain.id} />
        <CardContent>
          <Grid item>
            <Typography variant="body">Residues: {chain.num_res}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body">Atoms: {chain.atoms}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body">First Res: {chain.first_res}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body">Last Res: {chain.last_res}</Typography>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChainCard
