import { Navigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import useAuth from '../../hooks/useAuth';

const PublicOnlyRoute = ({ children }: PropsWithChildren) => {
  const { user, loading } = useAuth();

  if (loading) {
    return children;
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default PublicOnlyRoute;




