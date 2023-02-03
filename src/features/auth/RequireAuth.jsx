import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentRoles } from 'features/auth/authSlice';

const RequireAuth = ({ allowedRoles }) => {
  const token = useSelector(selectCurrentToken);
  const roles = useSelector(selectCurrentRoles);
  const location = useLocation();

  return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
