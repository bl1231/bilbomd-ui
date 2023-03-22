import React from 'react'
import { Grid } from '@mui/material'

import ChainCard from './ChainCard'

const CrdSummary = (props) => {
  const { chains } = props

  const chainCard = (
    <Grid container spacing={3}>
      {chains.map((chain) => (
        <Grid item xs={12} md={3} lg={3} key={chain.id}>
          <ChainCard chain={chain} />
        </Grid>
      ))}
    </Grid>
  )

  return chainCard
}

export default CrdSummary
