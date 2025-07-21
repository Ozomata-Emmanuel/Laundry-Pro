import { Navigate, Outlet } from 'react-router-dom';
import getUsersFromTokens from '../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const users = getUsersFromTokens();

  if (!users) return <Navigate to="/auth" replace />;

  const isAllowed = Object.values(users).some(user => 
    allowedRoles.includes(user.role)
  );

  if (!isAllowed) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
