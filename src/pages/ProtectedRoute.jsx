import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, initialLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user, 'initialLoading:', initialLoading);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('No user, redirecting to login with state:', { from: location });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering children or outlet');
  return children ? children : <Outlet />;
};

export default ProtectedRoute;