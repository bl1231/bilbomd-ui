import { createTheme, Theme } from '@mui/material'
import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { useColorTheme } from './useColorTheme'

type ThemeContextType = {
  mode: string
  toggleColorMode: () => void
  theme: Theme
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {
    console.log('in here')
  },
  theme: createTheme()
})

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useColorTheme()
  console.log('ThemeContextProvider', value)
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => {
  // console.log('ThemeContext: ', ThemeContext)
  return useContext(ThemeContext)
}
