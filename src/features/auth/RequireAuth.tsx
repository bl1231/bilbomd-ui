import { useLocation, Navigate, Outlet } from 'react-router'
import useAuth from 'hooks/useAuth'

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const location = useLocation()
  const { roles } = useAuth()

  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to='unauthorized' state={{ from: location }} replace />
  )

  return content
}

export default RequireAuth
