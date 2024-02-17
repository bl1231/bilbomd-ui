import { Grid } from '@mui/material'
import { Chain } from 'types/interfaces'
import ChainCard from './ChainCard'

interface ChainSummaryProps {
  chains: Chain[]
}

const ChainSummary = ({ chains }: ChainSummaryProps) => {
  // console.log('ChainSummary', chains)
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

export default ChainSummary
