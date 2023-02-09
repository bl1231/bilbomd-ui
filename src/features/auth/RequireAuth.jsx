import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from 'hooks/useAuth'

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation()
  const { roles } = useAuth()

  // if we find at least one of the allowed rolesz we're good to go.
  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate
      to="/magicklink"
      state={{ from: location }}
      replace
    />
  )

  return content
}

export default RequireAuth
