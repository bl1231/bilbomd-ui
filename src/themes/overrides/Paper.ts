export default function Paper(theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
          ...theme.typography.body2,
          textAlign: 'left',
          color: theme.palette.text.primary,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }
      }
    }
  }
}
