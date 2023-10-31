// import { useSelector } from 'react-redux'
import { selectCurrentToken } from 'features/auth/authSlice'
import { jwtDecode } from 'jwt-decode'
import { useAppSelector } from 'app/hooks'

interface JwtPayload {
  UserInfo: BilboMDJwtPayload
}

interface BilboMDJwtPayload {
  username: string
  roles: string[]
  email: string
}

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken)
  let isManager = false
  let isAdmin = false
  let status = 'User'

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token)
    const { username, roles, email } = decoded.UserInfo
    //console.log('useAuth1:', username, roles, email)

    isManager = roles.includes('Manager')
    isAdmin = roles.includes('Admin')

    if (isManager) status = 'Manager'
    if (isAdmin) status = 'Admin'

    //console.log('aueAuth2:', username, roles, status, isManager, isAdmin, email)
    return { username, roles, status, isManager, isAdmin, email }
  }
  // Returned if we do not have a token
  return { username: '', roles: [], email: '', isManager, isAdmin, status }
}

export default useAuth
