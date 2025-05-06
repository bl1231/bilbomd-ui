import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  sx?: object
}

const BoxDataGridWrapper = ({ children, sx = {} }: Props) => {
  return (
    <Box
      sx={{
        p: 0,
        border: 1,
        borderRadius: 1,
        borderColor: grey[500],
        backgroundColor: grey[200],
        mx: 'auto',
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'calc(100vw - 260px)',
        overflow: 'hidden',
        ...sx
      }}
    >
      {children}
    </Box>
  )
}

export default BoxDataGridWrapper
