import { Box, Typography } from '@mui/material'

const FeaturesList = ({ features }: { features: React.ReactNode[] }) => (
  <Box sx={{ mb: 11 }}>
    <Typography variant='h2' sx={{ my: 3 }}>
      Current Features:
    </Typography>
    <ul>
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </Box>
)

export default FeaturesList
