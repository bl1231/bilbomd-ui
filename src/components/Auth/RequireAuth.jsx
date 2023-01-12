import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    // only allow Outlet if we have an auth object.
    // We should only have an auth object if user is authenticated.

    // roles -> is an array within auth that contains the roles for this user
    //
    // allowedRoles -> is an array passed into RequireAuth that contains
    //   the roles allowed to access this particular component.
    return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
        <Outlet user={auth.user} />
    ) : auth?.user ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;
