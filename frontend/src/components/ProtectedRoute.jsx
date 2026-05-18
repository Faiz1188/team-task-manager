import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Wraps routes that require authentication (and optionally a specific role).
 * Props:
 *   - allowedRoles?: string[]   if provided, only these roles can access
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
