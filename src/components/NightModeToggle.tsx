import { Button, ButtonProps } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeContext } from '../themes/ThemeContext'

const NightModeToggle: React.FC<ButtonProps> = ({ sx, ...props }) => {
  const { mode, toggleColorMode } = useThemeContext()

  return (
    <Button
      onClick={toggleColorMode}
      color='inherit'
      size='large'
      endIcon={mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      sx={{
        backgroundColor: mode === 'dark' ? 'grey.800' : 'grey.200',
        color: mode === 'dark' ? 'grey.200' : 'grey.800',
        '&:hover': {
          backgroundColor: mode === 'dark' ? 'grey.700' : 'grey.300'
        },
        borderRadius: '20px', // Optional: adds a rounded look
        px: 2, // Optional: padding for a better button size
        ...sx
      }}
      {...props}
    >
      {mode === 'dark' ? `light mode` : `dark mode`}
    </Button>
  )
}

export default NightModeToggle
