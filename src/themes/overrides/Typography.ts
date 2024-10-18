export default function Typography() {
  return {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 12
        }
      },
      variants: [
        {
          props: { variant: 'mythingee' },
          style: {
            textTransform: 'uppercase',
            fontSize: 12,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            fontWeight: 500,
            padding: '0.5rem',
            background: '#888',
            color: '#fff',
            letterSpacing: '1px',
            py: 2
          }
        }
      ]
    }
  }
}
