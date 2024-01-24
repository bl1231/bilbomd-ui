import { createTheme, PaletteMode } from '@mui/material'
import { useMemo, useState } from 'react'
import { getDesignTokens } from './theme'

export const useColorTheme = () => {
  const [mode, setMode] = useState<PaletteMode>('light')

  const toggleColorMode = () => {
    // console.log('toggleColorMode function called')
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }
  // console.log('mode:', mode)
  const modifiedTheme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return {
    theme: modifiedTheme,
    mode,
    toggleColorMode
  }
}
