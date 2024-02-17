import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { Chain } from 'types/interfaces'
import { useTheme } from '@mui/material/styles'
interface ChainCardProps {
  chain: Chain
}

const ChainCard = ({ chain }: ChainCardProps) => {
  const theme = useTheme()
  return (
    <>
      <Card
        elevation={1}
        sx={{
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[600]
        }}
      >
        <CardHeader title={'Chain ID:  ' + chain.id} />
        <CardContent>
          <Typography>Type: {chain.type}</Typography>
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
