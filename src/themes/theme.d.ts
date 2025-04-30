// src/themes/theme.d.ts
import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    bilbomdStatus: {
      completed: string
      error: string
      running: string
      submitted: string
      pending: string
      failed: string
      cancelled: string
      unknown: string
    }
  }

  interface PaletteOptions {
    bilbomdStatus?: {
      completed?: string
      submitted?: string
      pending?: string
      failed?: string
      cancelled?: string
      unknown?: string
    }
  }
}
