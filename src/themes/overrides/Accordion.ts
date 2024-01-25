export default function Accordion(theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
          ...theme.typography.body2,
          textAlign: 'left',
          color: theme.palette.text.primary,
          padding: '0px'
        }
      }
    }
  }
}