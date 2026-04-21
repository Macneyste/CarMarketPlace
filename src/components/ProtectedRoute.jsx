import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
