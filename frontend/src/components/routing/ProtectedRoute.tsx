import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { PropsWithChildren } from 'react';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;




