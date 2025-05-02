import Menu, { MenuProps } from '@mui/material/Menu'
import { styled, alpha } from '@mui/material/styles'

const StyledMenu = styled(
  (props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      {...props}
    />
  ),
  {
    shouldForwardProp: (prop) => prop !== 'touchRippleRef'
  }
)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 4,
    border: '1px solid',
    borderColor: theme.palette.primary.light,
    marginTop: theme.spacing(1),
    minWidth: 150,
    color:
      theme.palette.mode === 'light'
        ? theme.palette.grey[800]
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        )
      }
    }
  }
}))

export { StyledMenu }
