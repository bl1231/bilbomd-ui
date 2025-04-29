import { styled } from '@mui/material/styles'
import { Paper } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

export default Item
