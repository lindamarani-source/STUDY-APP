import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
