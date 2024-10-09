import { Box, SxProps } from '@mui/material'
import { ReactNode } from 'react'

interface HeaderBoxProps {
  children: ReactNode
  sx?: SxProps
  // Add any other custom props here
}

const HeaderBox = ({ children, ...props }: HeaderBoxProps) => {
  return (
    <Box
      sx={{
        textTransform: 'uppercase',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        fontWeight: 500,
        padding: '0.5rem',
        background: '#888',
        color: '#fff',
        letterSpacing: '1px',
        py: 2,
        ...props.sx
      }}
    >
      {children}
    </Box>
  )
}

export default HeaderBox
