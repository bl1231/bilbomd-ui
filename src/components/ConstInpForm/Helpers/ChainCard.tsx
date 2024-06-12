import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { Chain } from 'types/interfaces'
import { useTheme } from '@mui/material/styles'

interface ChainCardProps {
  chain: Chain
}

const getTypeFullName = (shortTypeName: string): string => {
  const typeMappings: { [key: string]: string } = {
    PRO: 'Protein',
    DNA: 'DNA',
    RNA: 'RNA',
    CAR: 'Carbohydrate'
    // Add more mappings as needed
  }

  return typeMappings[shortTypeName] || shortTypeName
}

const ChainCard = ({ chain }: ChainCardProps) => {
  const theme = useTheme()

  // Define background colors for different chain types
  const customColors = {
    PRO: theme.palette.mode === 'light' ? '#E6A8A8' : '#b76e79',
    DNA: theme.palette.mode === 'light' ? '#E9D8A6' : '#b3a272',
    RNA: theme.palette.mode === 'light' ? '#B5E3D8' : '#6daba4',
    CAR: theme.palette.mode === 'light' ? '#A8CCE6' : '#6b95b8',
    Other: theme.palette.mode === 'light' ? '#D1A8E6' : '#9773b9'
  }

  // Select the background color based on the chain type
  const cardBackgroundColor =
    customColors[chain.type] || theme.palette.grey[400]
  // Dynamically calculate the contrasting text color for accessibility
  const cardHeaderColor = theme.palette.getContrastText(cardBackgroundColor)

  return (
    <Card elevation={1} sx={{ backgroundColor: cardBackgroundColor }}>
      <CardHeader
        title={`Chain ID: ${chain.id}`}
        sx={{
          backgroundColor: cardHeaderColor,
          color: cardBackgroundColor
        }}
      />
      <CardContent>
        <Typography variant='h5' color='textPrimary'>
          {getTypeFullName(chain.type)}
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Residues: {chain.num_res}
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Atoms: {chain.atoms}
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          First Res: {chain.first_res}
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Last Res: {chain.last_res}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ChainCard
