import { Grid, Typography } from '@mui/material'
import EditProfileForm from './EditProfileForm'

const UserAccount = () => {
  const content = (
    <Grid container>
      <Grid item>
        <Typography>Edit your account setting here</Typography>
        <EditProfileForm />
      </Grid>
    </Grid>
  )
  return content
}

export default UserAccount
