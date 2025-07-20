import { Navigate, Outlet } from 'react-router-dom';
import getUserFromToken from '../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = getUserFromToken();
  if (!user) return <Navigate to="/auth" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
