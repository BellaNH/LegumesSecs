import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import PageLoader from './PageLoader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useGlobalContext();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
