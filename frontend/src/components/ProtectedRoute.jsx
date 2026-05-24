import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROUTES } from '../utils/constants';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    const redirectTo = role === ROLES.MEMBER ? ROUTES.MEMBER.DASHBOARD : ROUTES.LIBRARIAN.DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
