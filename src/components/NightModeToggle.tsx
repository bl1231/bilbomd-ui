import { Button, ButtonProps } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeContext } from '../themes/ThemeContext'

// interface NightModeToggleProps extends ButtonProps {}

const NightModeToggle: React.FC<ButtonProps> = ({ sx, ...props }) => {
  const { mode, toggleColorMode } = useThemeContext()

  return (
    <Button
      onClick={toggleColorMode}
      color='inherit'
      size='large'
      endIcon={mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      sx={sx}
      {...props}
    >
      {mode === 'dark' ? `light mode` : `dark mode`}
    </Button>
  )
}

export default NightModeToggle
