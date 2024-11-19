import { FC, PropsWithChildren } from 'react'
import { ThemeContext } from './ThemeContext'
import { useColorTheme } from './useColorTheme'

// The provider component
export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useColorTheme()
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
