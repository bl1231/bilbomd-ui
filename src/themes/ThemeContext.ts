import { createContext, useContext } from 'react'
import { createTheme, Theme } from '@mui/material'

type ThemeContextType = {
  mode: string
  toggleColorMode: () => void
  theme: Theme
}

// Create the context
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {
    console.log('toggleColorMode not initialized')
  },
  theme: createTheme()
})

// Hook to use the context
export const useThemeContext = () => useContext(ThemeContext)
