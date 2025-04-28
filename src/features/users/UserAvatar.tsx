import { Typography, Box, Chip } from '@mui/material'
import { teal, purple } from '@mui/material/colors'
interface UserAvatarProps {
  username: string
  email: string
  status: string
}

const UserAvatar = ({ username, email, status }: UserAvatarProps) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        mx: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: teal[100],
        borderRadius: 1
      }}
    >
      <Typography variant='subtitle1'>{username}</Typography>
      <Typography variant='caption' color='textSecondary'>
        {email}
      </Typography>
      <Chip
        label={status}
        size='small'
        sx={{
          mt: 0.5,
          bgcolor: purple[300],
          color: 'white'
        }}
      />
      {/* Future: Avatar could go here */}
    </Box>
  )
}

export default UserAvatar
