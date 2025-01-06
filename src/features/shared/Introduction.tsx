import { Box, Typography } from '@mui/material'

interface IntroductionProps {
  title: string
  children: React.ReactNode
}

const Introduction = ({ title, children }: IntroductionProps) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography variant='h1' sx={{ my: 3 }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ m: 2, p: 0 }}>{children}</Box>
  </Box>
)

export default Introduction
