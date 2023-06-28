import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { Chain } from 'types/interfaces'

interface ChainCardProps {
  chain: Chain
}

const ChainCard = ({ chain }: ChainCardProps) => {
  // console.log(chain)
  return (
    <>
      <Card elevation={1} sx={{ background: '#fff1f0' }}>
        <CardHeader title={'Chain ID: ' + chain.id} />
        <CardContent>
          <Typography variant="body1">Residues: {chain.num_res}</Typography>
          <Typography variant="body1">Atoms: {chain.atoms}</Typography>
          <Typography variant="body1">First Res: {chain.first_res}</Typography>
          <Typography variant="body1">Last Res: {chain.last_res}</Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default ChainCard
