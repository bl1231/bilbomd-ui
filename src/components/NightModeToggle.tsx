import { Box, IconButton } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeContext } from '../themes/ThemeContext'

const NightModeToggle = () => {
  const { mode, toggleColorMode } = useThemeContext()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderColor: 'text.primary',
        border: '1px solid',
        borderRadius: 2,
        pl: 2,
        mx: 2
      }}
    >
      {mode} mode
      <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color='inherit'>
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  )
}

export default NightModeToggle
