import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './useAuth';

export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

RequireAuth.propTypes = {
  children: PropTypes.node,
};
